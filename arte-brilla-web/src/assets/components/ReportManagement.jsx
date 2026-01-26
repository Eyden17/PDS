import React, { useState, useMemo, useRef, useEffect } from 'react';
import '../styles/ReportManagement.css';
import logo from '../images/logoArteBrilla.png';
import { reportService } from '../../services/reportService'; // <-- ajustá ruta si aplica

const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

const ReportManagement = () => {
  // filtros UI
  const now = new Date();
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1); // 1..12
  const [filterGrupo, setFilterGrupo] = useState('Todos');

  // estados de data
  const [rows, setRows] = useState([]);      // data cruda del API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reportRef = useRef(null);

  // catálogo UI (labels)
  const grupos = useMemo(() => ({
    'Babies (3-5 años)': { color: '#ec4899' },
    'Minies (6+ años)': { color: '#8b5cf6' },
    'Artes Proféticas': { color: '#f4a460' }
  }), []);

  // helpers label <-> BD
  const uiGroupToDb = (ui) => {
    if (ui === 'Babies (3-5 años)') return 'Babies';
    if (ui === 'Minies (6+ años)') return 'Minies';
    if (ui === 'Artes Proféticas') return 'Artes Proféticas';
    return null;
  };

  const dbGroupToUi = (db) => {
    if (db === 'Babies') return 'Babies (3-5 años)';
    if (db === 'Minies') return 'Minies (6+ años)';
    if (db === 'Artes Proféticas') return 'Artes Proféticas';
    return db || '';
  };

  // ====== FETCH REPORT ======
  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');

      const groupDb = filterGrupo === 'Todos' ? null : uiGroupToDb(filterGrupo);

      const data = await reportService.getCobranza({
        year: filterYear,
        month: filterMonth,
        group: groupDb,
        onlyDebtors: false, // si querés luego un toggle "solo deudores"
        limit: 500,
        offset: 0
      });

      // data viene como array (porque el API hace res.json(data))
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Error cargando reporte');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterYear, filterMonth, filterGrupo]);

  /**
   * Normalizamos a la estructura que tu UI ya usa:
   * NOTA: aquí asumo que tu SP devuelve algo tipo:
   * - student_id, full_name, group_name, amount_due, amount_paid, balance, status
   * Si tu SP usa otros nombres, decime los campos y lo ajusto exacto.
   */
  const datosPagos = useMemo(() => {
    const mesNombre = MONTHS[filterMonth - 1] || '';

    return rows.map((r) => {
      const amountDue = Number(r.amount_due ?? r.amount ?? 0);
      const amountPaid = Number(r.amount_paid ?? r.paid_amount ?? 0);
      const balance = Number(r.balance ?? r.saldo ?? (amountDue - amountPaid));

      const status = (r.status ?? '').toUpperCase();
      const pagado = status === 'PAID';

      return {
        id: r.student_id ?? r.id,
        nombre: r.full_name ?? r.student_name ?? '',
        grupo: dbGroupToUi(r.group_name),
        cantidadOriginal: amountDue,
        mes: mesNombre,
        pagado,
        saldoDeudor: pagado ? 0 : Math.max(0, balance),
        abonos: [] // si luego traés abonos del SP, lo llenamos aquí
      };
    });
  }, [rows, filterMonth]);

  // filtros client-side extra (si alguna vez traés más de un mes)
  const pagosFiltrados = useMemo(() => {
    return datosPagos.filter(pago => {
      const cumpleGrupo = filterGrupo === 'Todos' || pago.grupo === filterGrupo;
      return cumpleGrupo;
    });
  }, [datosPagos, filterGrupo]);

  const statsFinancieros = useMemo(() => {
    const totalEstudiantes = pagosFiltrados.length;

    const totalIngresos = pagosFiltrados.reduce((sum, p) => sum + (p.cantidadOriginal - p.saldoDeudor), 0);
    const totalAdeudado = pagosFiltrados.reduce((sum, p) => sum + p.saldoDeudor, 0);
    const totalMatricula = pagosFiltrados.reduce((sum, p) => sum + p.cantidadOriginal, 0);

    const estudiantesPagados = pagosFiltrados.filter(p => p.pagado).length;
    const estudiantesPendientes = totalEstudiantes - estudiantesPagados;
    const porcentajePago = totalEstudiantes > 0 ? ((estudiantesPagados / totalEstudiantes) * 100).toFixed(1) : 0;

    const porGrupo = {};
    Object.keys(grupos).forEach(grupo => {
      const estudiantesGrupo = pagosFiltrados.filter(p => p.grupo === grupo);
      const ingresosGrupo = estudiantesGrupo.reduce((sum, p) => sum + (p.cantidadOriginal - p.saldoDeudor), 0);
      const adeudadoGrupo = estudiantesGrupo.reduce((sum, p) => sum + p.saldoDeudor, 0);
      const pagadosGrupo = estudiantesGrupo.filter(p => p.pagado).length;

      porGrupo[grupo] = {
        total: estudiantesGrupo.length,
        ingresos: ingresosGrupo,
        adeudado: adeudadoGrupo,
        pagados: pagadosGrupo,
        pendientes: estudiantesGrupo.length - pagadosGrupo
      };
    });

    return {
      totalEstudiantes,
      totalIngresos,
      totalAdeudado,
      totalMatricula,
      estudiantesPagados,
      estudiantesPendientes,
      porcentajePago,
      porGrupo
    };
  }, [pagosFiltrados, grupos]);

  const getGroupColor = (grupo) => {
    return grupos[grupo]?.color || '#667eea';
  };

  return (
    <>
      <div className="report-management" ref={reportRef}>
        <div className="report-header">
          <img src={logo} alt="Arte Brilla" className="report-logo" />
          <h2>Reporte de Cobranza</h2>
          <p>Resumen de pagos y deudas</p>
        </div>

        {/* Filtros */}
        <div className="report-filters">
          <div className="filter-group">
            <label>Año</label>
            <input
              type="number"
              value={filterYear}
              onChange={(e) => setFilterYear(Number(e.target.value))}
              min="2020"
              max="2100"
            />
          </div>

          <div className="filter-group">
            <label>Mes</label>
            <select value={filterMonth} onChange={(e) => setFilterMonth(Number(e.target.value))}>
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx + 1}>{m}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Grupo</label>
            <select value={filterGrupo} onChange={(e) => setFilterGrupo(e.target.value)}>
              <option value="Todos">Todos los grupos</option>
              {Object.keys(grupos).map(grupo => (
                <option key={grupo} value={grupo}>{grupo}</option>
              ))}
            </select>
          </div>

          <button
            className="btn-reset-filters"
            onClick={() => {
              setFilterYear(now.getFullYear());
              setFilterMonth(now.getMonth() + 1);
              setFilterGrupo('Todos');
            }}
          >
            🔄 Limpiar Filtros
          </button>
        </div>

        {/* estados */}
        {loading && <div className="empty-state"><p>⏳ Cargando reporte...</p></div>}
        {!loading && error && <div className="empty-state"><p>⚠️ {error}</p></div>}

        {!loading && !error && (
          <>
            {/* KPI Grid */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon">💰</div>
                <div className="kpi-content">
                  <span className="kpi-label">Total Ingresos</span>
                  <span className="kpi-value">₡{statsFinancieros.totalIngresos.toLocaleString()}</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">⏳</div>
                <div className="kpi-content">
                  <span className="kpi-label">Total Adeudado</span>
                  <span className="kpi-value">₡{statsFinancieros.totalAdeudado.toLocaleString()}</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">👥</div>
                <div className="kpi-content">
                  <span className="kpi-label">Estudiantes</span>
                  <span className="kpi-value">{statsFinancieros.totalEstudiantes}</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">📈</div>
                <div className="kpi-content">
                  <span className="kpi-label">Tasa de Cobranza</span>
                  <span className="kpi-value">{statsFinancieros.porcentajePago}%</span>
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '2px solid #e8e8e8', margin: '24px 0' }} />

            {/* Resumen por Grupo */}
            <div className="chart-section" style={{ marginBottom: 32 }}>
              <h3 style={{ color: '#667eea', fontSize: 18, marginBottom: 12 }}>Resumen por Grupo</h3>
              <table className="chart-table">
                <thead>
                  <tr>
                    <th>Grupo</th>
                    <th>Total</th>
                    <th>Pagados</th>
                    <th>Pendientes</th>
                    <th>% Cobranza</th>
                    <th>Ingresos</th>
                    <th>Adeudado</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(statsFinancieros.porGrupo).map(([grupo, datos]) => (
                    <tr key={grupo}>
                      <td>{grupo}</td>
                      <td>{datos.total}</td>
                      <td style={{ color: '#155724', background: '#d4edda', fontWeight: 700 }}>{datos.pagados}</td>
                      <td style={{ color: '#856404', background: '#fff3cd', fontWeight: 700 }}>{datos.pendientes}</td>
                      <td style={{ fontWeight: 700 }}>
                        {datos.total > 0 ? ((datos.pagados / datos.total) * 100).toFixed(1) : 0}%
                      </td>
                      <td style={{ color: '#155724', background: '#d4edda', fontWeight: 700 }}>
                        ₡{datos.ingresos.toLocaleString()}
                      </td>
                      <td style={{ color: '#721c24', background: '#f8d7da', fontWeight: 700 }}>
                        ₡{datos.adeudado.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Estudiantes con saldo deudor */}
            <div className="chart-section">
              <h3 style={{ color: '#ec4899', fontSize: 18, marginBottom: 12 }}>Estudiantes con Saldo Deudor</h3>
              <table className="chart-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Grupo</th>
                    <th>Mes</th>
                    <th>Matrícula</th>
                    <th>Pagado</th>
                    <th>Saldo Deudor</th>
                    <th>% Deuda</th>
                  </tr>
                </thead>
                <tbody>
                  {pagosFiltrados.filter(e => e.saldoDeudor > 0).length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: '#4caf50', fontWeight: 600, padding: 16 }}>
                        ¡Excelente! No hay estudiantes con saldo deudor.
                      </td>
                    </tr>
                  ) : (
                    pagosFiltrados
                      .filter(e => e.saldoDeudor > 0)
                      .sort((a, b) => b.saldoDeudor - a.saldoDeudor)
                      .map(estudiante => {
                        const porcentajeDeuda = estudiante.cantidadOriginal > 0
                          ? ((estudiante.saldoDeudor / estudiante.cantidadOriginal) * 100).toFixed(1)
                          : '0.0';
                        const pagado = estudiante.cantidadOriginal - estudiante.saldoDeudor;

                        return (
                          <tr key={estudiante.id}>
                            <td>{estudiante.nombre}</td>
                            <td>
                              <span className="group-badge" style={{ borderLeftColor: getGroupColor(estudiante.grupo) }}>
                                {estudiante.grupo}
                              </span>
                            </td>
                            <td>{estudiante.mes}</td>
                            <td>₡{estudiante.cantidadOriginal.toLocaleString()}</td>
                            <td style={{ color: '#155724', background: '#d4edda', fontWeight: 700 }}>
                              ₡{pagado.toLocaleString()}
                            </td>
                            <td style={{ color: '#721c24', background: '#f8d7da', fontWeight: 700 }}>
                              ₡{estudiante.saldoDeudor.toLocaleString()}
                            </td>
                            <td style={{ fontWeight: 700 }}>{porcentajeDeuda}%</td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ReportManagement;
