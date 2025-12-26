import React, { useState, useMemo, useRef } from 'react';
import '../styles/ReportManagement.css';

const ReportManagement = () => {
  const [filterMes, setFilterMes] = useState('');
  const [filterGrupo, setFilterGrupo] = useState('Todos');
  const reportRef = useRef(null);

  const grupos = useMemo(() => ({
    'Babies (3-5 años)': { color: '#ec4899', total: 8 },
    'Minies (6+ años)': { color: '#8b5cf6', total: 10 },
    'Artes Proféticas': { color: '#f4a460', total: 7 }
  }), []);

  const datosEjemploPagos = useMemo(() => [
    { id: 1, nombre: 'Juan Pérez', grupo: 'Babies (3-5 años)', cantidadOriginal: 100000, mes: 'Diciembre', pagado: false, saldoDeudor: 100000, abonos: [] },
    { id: 2, nombre: 'María García', grupo: 'Minies (6+ años)', cantidadOriginal: 50000, mes: 'Diciembre', pagado: true, saldoDeudor: 0, abonos: [{ fecha: '20/12/2025', monto: 50000 }] },
    { id: 3, nombre: 'Carlos López', grupo: 'Artes Proféticas', cantidadOriginal: 75000, mes: 'Diciembre', pagado: false, saldoDeudor: 45000, abonos: [{ fecha: '15/12/2025', monto: 30000 }] },
    { id: 4, nombre: 'Ana Martínez', grupo: 'Babies (3-5 años)', cantidadOriginal: 50000, mes: 'Diciembre', pagado: true, saldoDeudor: 0, abonos: [{ fecha: '18/12/2025', monto: 50000 }] },
    { id: 5, nombre: 'Sofia Rodríguez', grupo: 'Minies (6+ años)', cantidadOriginal: 60000, mes: 'Noviembre', pagado: false, saldoDeudor: 25000, abonos: [{ fecha: '10/11/2025', monto: 35000 }] },
    { id: 6, nombre: 'Pedro Sánchez', grupo: 'Babies (3-5 años)', cantidadOriginal: 100000, mes: 'Diciembre', pagado: true, saldoDeudor: 0, abonos: [{ fecha: '22/12/2025', monto: 100000 }] },
    { id: 7, nombre: 'Laura González', grupo: 'Artes Proféticas', cantidadOriginal: 75000, mes: 'Diciembre', pagado: true, saldoDeudor: 0, abonos: [{ fecha: '19/12/2025', monto: 75000 }] },
    { id: 8, nombre: 'Miguel Torres', grupo: 'Minies (6+ años)', cantidadOriginal: 60000, mes: 'Diciembre', pagado: false, saldoDeudor: 60000, abonos: [] },
    { id: 9, nombre: 'Lucía Ríos', grupo: 'Babies (3-5 años)', cantidadOriginal: 75000, mes: 'Noviembre', pagado: true, saldoDeudor: 0, abonos: [{ fecha: '08/11/2025', monto: 75000 }] },
    { id: 10, nombre: 'Roberto Silva', grupo: 'Minies (6+ años)', cantidadOriginal: 50000, mes: 'Diciembre', pagado: true, saldoDeudor: 0, abonos: [{ fecha: '21/12/2025', monto: 50000 }] }
  ], []);

  const pagosFiltrados = useMemo(() => {
    return datosEjemploPagos.filter(pago => {
      const cumpleMes = !filterMes || pago.mes === filterMes;
      const cumpleGrupo = filterGrupo === 'Todos' || pago.grupo === filterGrupo;
      return cumpleMes && cumpleGrupo;
    });
  }, [filterMes, filterGrupo, datosEjemploPagos]);

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

  const meses = useMemo(() => {
    return [...new Set(datosEjemploPagos.map(p => p.mes))];
  }, [datosEjemploPagos]);



  return (
    <>


      {/* DASHBOARD WEB */}
      <div className="report-management" ref={reportRef}>
        
        {/* Filtros */}
        <div className="report-filters">
          <div className="filter-group">
            <label>Mes</label>
            <select value={filterMes} onChange={(e) => setFilterMes(e.target.value)}>
              <option value="">Todos los meses</option>
              {meses.map(mes => (
                <option key={mes} value={mes}>{mes}</option>
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
          <button className="btn-reset-filters" onClick={() => { setFilterMes(''); setFilterGrupo('Todos'); }}>
            🔄 Limpiar Filtros
          </button>

        </div>

        {/* KPI Grid */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon">💰</div>
            <div className="kpi-content">
              <span className="kpi-label">Total Ingresos</span>
              <span className="kpi-value">${statsFinancieros.totalIngresos.toLocaleString()}</span>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">⏳</div>
            <div className="kpi-content">
              <span className="kpi-label">Total Adeudado</span>
              <span className="kpi-value">${statsFinancieros.totalAdeudado.toLocaleString()}</span>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">👥</div>
            <div className="kpi-content">
              <span className="kpi-label">Estudiantes Activos</span>
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

        {/* Tabla Resumen Grupo */}
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
                  <td style={{ fontWeight: 700 }}>{datos.total > 0 ? ((datos.pagados / datos.total) * 100).toFixed(1) : 0}%</td>
                  <td style={{ color: '#155724', background: '#d4edda', fontWeight: 700 }}>${datos.ingresos.toLocaleString()}</td>
                  <td style={{ color: '#721c24', background: '#f8d7da', fontWeight: 700 }}>${datos.adeudado.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabla Deudas */}
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
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#4caf50', fontWeight: 600, padding: 16 }}>¡Excelente! No hay estudiantes con saldo deudor.</td></tr>
              ) : (
                pagosFiltrados.filter(e => e.saldoDeudor > 0).sort((a, b) => b.saldoDeudor - a.saldoDeudor).map(estudiante => {
                  const porcentajeDeuda = ((estudiante.saldoDeudor / estudiante.cantidadOriginal) * 100).toFixed(1);
                  const pagado = estudiante.cantidadOriginal - estudiante.saldoDeudor;
                  return (
                    <tr key={estudiante.id}>
                      <td>{estudiante.nombre}</td>
                      <td>{estudiante.grupo}</td>
                      <td>{estudiante.mes}</td>
                      <td>${estudiante.cantidadOriginal.toLocaleString()}</td>
                      <td style={{ color: '#155724', background: '#d4edda', fontWeight: 700 }}>${pagado.toLocaleString()}</td>
                      <td style={{ color: '#721c24', background: '#f8d7da', fontWeight: 700 }}>${estudiante.saldoDeudor.toLocaleString()}</td>
                      <td style={{ fontWeight: 700 }}>{porcentajeDeuda}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
};

export default ReportManagement;