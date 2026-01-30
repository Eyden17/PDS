import React, { useEffect, useMemo, useState } from "react";
import { studentService } from "../../services/studentService";
import { monthlyFeeService } from "../../services/monthlyFeeService";
import { paymentService } from "../../services/paymentService";
import { classService } from "../../services/classService";
import "../styles/PaymentManagement.css";

function monthNameEs(m) {
  const names = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];
  return names[m - 1] || String(m);
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const PaymentManagement = () => {
  // ===== data =====
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [fees, setFees] = useState([]); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===== filtros UI =====
  const now = new Date();
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1);
  const [filterGroup, setFilterGroup] = useState(""); // por nombre de grupo
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all | pending | paid

  // ===== modal pago =====
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("EFECTIVO"); // EFECTIVO | SINPE | TRANSFERENCIA
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  // ===== modal historial =====
  const [historyOpenId, setHistoryOpenId] = useState(null);
  const [historyPayments, setHistoryPayments] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // ===== generar mensualidades =====
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateAmount, setGenerateAmount] = useState("0"); // monto base
  const [generateGroupId, setGenerateGroupId] = useState("");
  const [generateStatus, setGenerateStatus] = useState(null);
  const [generateLoading, setGenerateLoading] = useState(false);

  useEffect(() => {
    const current = new Date();
    setFilterYear(current.getFullYear());
    setFilterMonth(current.getMonth() + 1);
  }, []);

  // ===== helpers fees =====
  const getFeeStatus = (row) => {
    // row: { amount_due, status, balance_due, is_paid }
    if (row.status === "PAID" || Number(row.balance_due) <= 0) {
      return { status: "paid", label: "Pagado", color: "#4CAF50", icon: "✓" };
    }
    if (row.status === "LATE") {
      return { status: "alert", label: "Atrasado", color: "#f44336", icon: "⚠" };
    }
    if (row.status === "PARTIAL") {
      return { status: "partial", label: "Abonando", color: "#ff9800", icon: "◐" };
    }
    return { status: "pending", label: "Pendiente", color: "#9e9e9e", icon: "⏳" };
  };

  const getProgress = (row) => {
    const due = Number(row.amount_due || 0);
    const paid = Number(row.amount_paid_total || 0);
    if (due <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((paid / due) * 100)));
  };

  // ===== carga inicial =====
  const fetchAll = async (year = filterYear, month = filterMonth) => {
    try {
      setLoading(true);
      setError("");

      // 1) estudiantes
      const sRes = await studentService.getAllStudents({ limit: 200, offset: 0 });
      const sRows = sRes?.data ?? sRes ?? [];
      setStudents(sRows);
      
      const gRes = await classService.listGroups();
      const gRows = gRes?.data ?? gRes ?? [];
      setGroups(gRows);

      const allFees = await monthlyFeeService.listFeesForMonth({ year, month });
      const rows = allFees?.data ?? allFees ?? [];

      // index por student_id para mapear rápido con la tabla de estudiantes
      const feeMap = new Map((rows || []).map((r) => [r.student_id, r]));

      const feesByStudent = (sRows || []).map((s) => {
        const r = feeMap.get(s.id);

        const fee = r && r.monthly_fee_id ? {
          id: r.monthly_fee_id,
          year: r.year,
          month: r.month,
          amount_due: r.amount_due,
          status: r.status,
          amount_paid_total: r.total_paid ?? 0,
          balance_due: r.balance ?? null,
        } : null;

        return { student: s, fee };
      });

      // 3) map a filas de tabla
      const mapped = feesByStudent.map(({ student, fee }) => {
        const first = student.first_name ?? "";
        const last = student.last_name ?? "";
        const fullName = `${first} ${last}`.trim() || "—";

        // group_name lo tenías en tu backend de students (si no, queda "—")
        const groupName = student.group_name ?? student.group ?? "—";

        // fee puede no existir aún
        const amount_due = fee?.amount_due ?? 0;
        const status = fee?.status ?? "PENDING";
        const monthly_fee_id = fee?.id ?? null;

        // si tu endpoint /api/monthly-fees/student/:id te devuelve totales, úsalo:
        // aquí asumimos que fee ya trae balance_due + amount_paid_total (si no, lo calculamos después con pagos)
        const amount_paid_total = fee?.amount_paid_total ?? fee?.amount_paid ?? 0;
        const balance_due =
          fee?.balance_due != null ? fee.balance_due : Math.max(0, Number(amount_due) - Number(amount_paid_total));

        return {
          student_id: student.id,
          identification: student.identification ?? "",
          student_name: fullName,
          group_name: groupName,
          year: Number(year),
          month: Number(month),

          monthly_fee_id,
          amount_due: Number(amount_due) || 0,
          amount_paid_total: Number(amount_paid_total) || 0,
          balance_due: Number(balance_due) || 0,
          status,

          // para render
          fee_raw: fee,
        };
      });

      setFees(mapped);
    } catch (e) {
      setError(e?.message || "Error cargando pagos");
      setStudents([]);
      setFees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // recargar cuando cambie mes/año
  useEffect(() => {
    fetchAll(filterYear, filterMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterYear, filterMonth]);

  // ===== filtros =====
  const filteredRows = useMemo(() => {
    const q = (filterName || "").toLowerCase();

    return fees.filter((r) => {
      const matchGroup = !filterGroup || String(r.group_name) === String(filterGroup);
      const matchName =
        !q ||
        String(r.student_name || "").toLowerCase().includes(q) ||
        String(r.identification || "").toLowerCase().includes(q);

      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "pending" && Number(r.balance_due) > 0) ||
        (filterStatus === "paid" && Number(r.balance_due) <= 0);

      return matchGroup && matchName && matchStatus;
    });
  }, [fees, filterGroup, filterName, filterStatus]);

  // stats
  const pendingRows = filteredRows.filter((r) => Number(r.balance_due) > 0);
  const paidRows = filteredRows.filter((r) => Number(r.balance_due) <= 0);
  const totalDue = pendingRows.reduce((sum, r) => sum + Number(r.balance_due || 0), 0);
  const totalOriginal = filteredRows.reduce((sum, r) => sum + Number(r.amount_due || 0), 0);
  const totalAbonado = filteredRows.reduce((sum, r) => sum + Number(r.amount_paid_total || 0), 0);
  const paymentPercentage = totalOriginal > 0 ? Math.round((totalAbonado / totalOriginal) * 100) : 0;

  const groupsFromStudents = useMemo(() => {
    const set = new Set((students || []).map((s) => s.group_name ?? s.group).filter(Boolean));
    return Array.from(set);
  }, [students]);

  // ===== pagos =====
  const openAbono = (row) => {
    if (!row.monthly_fee_id) {
      alert("Este estudiante aún no tiene cuota generada para este mes.");
      return;
    }
    setSelectedRow(row);
    setPaymentAmount("");
    setPaymentMethod("EFECTIVO");
    setPaymentReference("");
    setPaymentNotes("");
    setShowPaymentModal(true);
  };

  const openPagoTotal = (row) => {
    if (!row.monthly_fee_id) {
      alert("Este estudiante aún no tiene cuota generada para este mes.");
      return;
    }
    setSelectedRow(row);
    setPaymentAmount(String(row.balance_due || 0));
    setPaymentMethod("EFECTIVO");
    setPaymentReference("");
    setPaymentNotes("");
    setShowPaymentModal(true);
  };

  const confirmPayment = async () => {
    try {
      const monto = Number(paymentAmount || 0);
      if (!selectedRow?.monthly_fee_id) return;
      if (!Number.isFinite(monto) || monto <= 0) return;

      if (monto > Number(selectedRow.balance_due || 0)) {
        alert("El abono no puede exceder el saldo.");
        return;
      }

      setLoading(true);

      await paymentService.createPayment({
        monthly_fee_id: selectedRow.monthly_fee_id,
        amount_paid: monto,
        method: paymentMethod,
        reference: paymentReference?.trim() || null,
        notes: paymentNotes?.trim() || null,
        paid_at: todayISO(),
      });

      setShowPaymentModal(false);
      setSelectedRow(null);

      await fetchAll(filterYear, filterMonth);
    } catch (e) {
      alert(e?.message || "Error registrando pago");
    } finally {
      setLoading(false);
    }
  };

  const openHistory = async (row) => {
    if (!row.monthly_fee_id) {
      alert("Este estudiante aún no tiene cuota generada para este mes.");
      return;
    }
    try {
      setHistoryOpenId(row.monthly_fee_id);
      setHistoryLoading(true);
      setHistoryPayments([]);

      const res = await paymentService.listPaymentsByMonthlyFee(row.monthly_fee_id);
      const rows = res?.data ?? res ?? [];
      setHistoryPayments(rows);
    } catch (e) {
      alert(e?.message || "Error cargando historial");
      setHistoryOpenId(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  // ===== generar cuotas =====
  const openGenerate = async () => {
    try {
      setGenerateLoading(true);
      setGenerateStatus(null);
      setGenerateGroupId("");

      const st = await monthlyFeeService.getMonthlyFeeStatus();
      // esperable: { year, month, exists, generated_count, ... } (depende tu back)
      setGenerateStatus(st?.data ?? st);
      setShowGenerateModal(true);
    } catch (e) {
      alert(e?.message || "Error consultando estado de mensualidades");
    } finally {
      setGenerateLoading(false);
    }
  };

  const confirmGenerate = async () => {
    try {
      const amount = Number(generateAmount || 0);
      if (!Number.isFinite(amount) || amount <= 0) {
        alert("Ingresa un monto válido (> 0).");
        return;
      }
      if (!generateGroupId) {
        alert("Selecciona un grupo para generar la cuota.");
        return;
      }

      setGenerateLoading(true);

      await monthlyFeeService.generateFeesByGroup({
        group_id: generateGroupId,
        amount_due: amount,
        year: filterYear,
        month: filterMonth,
      });

      setShowGenerateModal(false);
      await fetchAll(filterYear, filterMonth);
    } catch (e) {
      alert(e?.message || "Error generando cuotas");
    } finally {
      setGenerateLoading(false);
    }
  };

  // ===== UI =====
  return (
    <div className="payment-management">
      <div className="management-header">
        <div>
          <h2>Control Financiero</h2>
          <p className="header-subtitle">Gestión de cuotas mensuales, pagos y control de cobranza</p>
        </div>

        <button className="btn-add-student" onClick={openGenerate} disabled={loading}>
          ➕ Generar cuota mensual
        </button>
      </div>

      {error && (
        <div className="empty-state">
          <p>⚠️ {error}</p>
        </div>
      )}
      {loading && (
        <div className="empty-state">
          <p>⏳ Cargando...</p>
        </div>
      )}

      {/* Filtro principal de periodo */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>Periodo</h3>
        </div>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Año</label>
            <input
              type="number"
              value={filterYear}
              onChange={(e) => setFilterYear(Number(e.target.value || now.getFullYear()))}
              min="2020"
              max="2100"
            />
          </div>

          <div className="filter-group">
            <label>Mes</label>
            <select value={filterMonth} onChange={(e) => setFilterMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {monthNameEs(m)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="payment-stats">
        <div className="stat-card stat-total">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">Total a Pagar</p>
            <p className="stat-value">₡{totalDue.toLocaleString()}</p>
            <p className="stat-meta">{pendingRows.length} estudiantes</p>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <p className="stat-label">Deudores Activos</p>
            <p className="stat-value">{pendingRows.length}</p>
            <p className="stat-meta">Con saldo pendiente</p>
          </div>
        </div>

        <div className="stat-card stat-paid">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <p className="stat-label">Saldos Pagados</p>
            <p className="stat-value">{paidRows.length}</p>
            <p className="stat-meta">0 saldo</p>
          </div>
        </div>

        <div className="stat-card stat-percentage">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <p className="stat-label">Cobranza General</p>
            <p className="stat-value">{paymentPercentage}%</p>
            <div className="progress-bar-stat">
              <div className="progress-fill" style={{ width: `${paymentPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>Filtros de Búsqueda</h3>
        </div>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Por Grupo</label>
            <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)}>
              <option value="">Todos los grupos</option>
              {(groups || []).map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Por Nombre / Cédula</label>
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Por Estado</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="paid">Pagados</option>
            </select>
          </div>

          <button
            className="btn-reset-filters"
            onClick={() => {
              setFilterGroup("");
              setFilterName("");
              setFilterStatus("all");
            }}
          >
            Limpiar Filtros
          </button>
        </div>
        <p className="filters-result">
          Mostrando {filteredRows.length} de {fees.length} registros
        </p>
      </div>

      {/* Tabla */}
      <div className="payment-table-section">
        <h3 className="section-title">📋 Detalle de Cuotas</h3>
        <div className="payment-table-wrapper">
          <table className="payment-table">
            <thead>
              <tr>
                <th className="col-status">Estado</th>
                <th className="col-student">Estudiante</th>
                <th className="col-group">Grupo</th>
                <th className="col-month">Mes</th>
                <th className="col-original">Monto</th>
                <th className="col-paid">Abonado</th>
                <th className="col-pending">Saldo</th>
                <th className="col-progress">Progreso</th>
                <th className="col-actions">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan="9" className="empty-message">
                    <p>No hay registros que coincidan con los filtros seleccionados</p>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const status = getFeeStatus(row);
                  const progress = getProgress(row);

                  return (
                    <tr key={`${row.student_id}-${row.year}-${row.month}`} className={`payment-row ${status.status}`}>
                      <td className="col-status">
                        <div className="status-badge" style={{ borderColor: status.color }}>
                          <span className="status-icon" style={{ color: status.color }}>
                            {status.icon}
                          </span>
                          <span className="status-label">{status.label}</span>
                        </div>
                      </td>

                      <td className="col-student">
                        <span className="student-name">{row.student_name}</span>
                        {row.identification && <div style={{ fontSize: 12, opacity: 0.7 }}>{row.identification}</div>}
                      </td>

                      <td className="col-group">
                        <span className="group-badge">{row.group_name}</span>
                      </td>

                      <td className="col-month">
                        <span className="month-badge">{monthNameEs(row.month)}</span>
                      </td>

                      <td className="col-original">
                        <span className="amount-original">₡{Number(row.amount_due || 0).toLocaleString()}</span>
                      </td>

                      <td className="col-paid">
                        <span className="amount-paid">₡{Number(row.amount_paid_total || 0).toLocaleString()}</span>
                      </td>

                      <td className="col-pending">
                        <span className={`amount-pending ${Number(row.balance_due) > 0 ? "alert" : "paid"}`}>
                          ₡{Number(row.balance_due || 0).toLocaleString()}
                        </span>
                      </td>

                      <td className="col-progress">
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${progress}%`, backgroundColor: status.color }}
                            ></div>
                          </div>
                          <span className="progress-text">{progress}%</span>
                        </div>
                      </td>

                      <td className="col-actions">
                        <div className="action-buttons">
                          {Number(row.balance_due) > 0 && (
                            <>
                              <button className="btn-action btn-abono" onClick={() => openAbono(row)} title="Registrar abono">
                                💵
                              </button>
                              <button className="btn-action btn-pago-total" onClick={() => openPagoTotal(row)} title="Pago total">
                                ✓
                              </button>
                            </>
                          )}

                          <button className="btn-action btn-history" onClick={() => openHistory(row)} title="Ver historial">
                            📋
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Registrar pago */}
      {showPaymentModal && selectedRow && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Registrar Pago</h3>
              <button className="btn-close" onClick={() => setShowPaymentModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="payment-details">
                <p>
                  <strong>Estudiante:</strong> {selectedRow.student_name}
                </p>
                <p>
                  <strong>Periodo:</strong> {monthNameEs(selectedRow.month)} {selectedRow.year}
                </p>
                <p>
                  <strong>Saldo Actual:</strong> ₡{Number(selectedRow.balance_due || 0).toLocaleString()}
                </p>
              </div>

              <div className="amount-input-group">
                <label>Monto a abonar (₡)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  min="1"
                  max={Number(selectedRow.balance_due || 0)}
                  placeholder="Ingresa el monto"
                />
              </div>

              <div className="amount-input-group">
                <label>Método</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="SINPE">SINPE</option>
                  <option value="TRANSFERENCIA">Transferencia</option>
                </select>
              </div>

              <div className="amount-input-group">
                <label>Referencia (opcional)</label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="Ej: comprobante / recibo"
                />
              </div>

              <div className="amount-input-group">
                <label>Notas (opcional)</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Ej: pagó la mamá / acordó saldo..."
                />
              </div>

              <div className="payment-summary">
                <div className="summary-row">
                  <span>Saldo después:</span>
                  <strong>
                    ₡{Math.max(0, Number(selectedRow.balance_due || 0) - Number(paymentAmount || 0)).toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-confirm"
                onClick={confirmPayment}
                disabled={
                  Number(paymentAmount || 0) <= 0 ||
                  Number(paymentAmount || 0) > Number(selectedRow.balance_due || 0) ||
                  loading
                }
              >
                Confirmar
              </button>
              <button className="btn-cancel-modal" onClick={() => setShowPaymentModal(false)} disabled={loading}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Historial */}
      {historyOpenId && (
        <div className="modal-overlay" onClick={() => setHistoryOpenId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Historial de Pagos</h3>
              <button className="btn-close" onClick={() => setHistoryOpenId(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              {historyLoading ? (
                <p style={{ textAlign: "center", opacity: 0.8 }}>⏳ Cargando...</p>
              ) : historyPayments.length === 0 ? (
                <p style={{ textAlign: "center", opacity: 0.8 }}>Sin pagos registrados</p>
              ) : (
                <div className="abonos-table">
                  <div className="abonos-header">
                    <span>Fecha</span>
                    <span>Monto</span>
                  </div>
                  {historyPayments.map((p) => (
                    <div key={p.id} className="abonos-row">
                      <span>{String(p.paid_at || "").slice(0, 10) || "—"}</span>
                      <span>₡{Number(p.amount_paid || 0).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="abonos-total">
                    <span>Total abonado:</span>
                    <span>
                      ₡
                      {historyPayments.reduce((s, x) => s + Number(x.amount_paid || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn-cancel-modal" onClick={() => setHistoryOpenId(null)} style={{ width: "100%" }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Generar cuotas */}
      {showGenerateModal && (
        <div className="modal-overlay" onClick={() => setShowGenerateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Generar cuota mensual</h3>
              <button className="btn-close" onClick={() => setShowGenerateModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p>
                Periodo: <strong>{monthNameEs(filterMonth)} {filterYear}</strong>
              </p>

              {generateStatus && (
                <div style={{ marginTop: 10, padding: 12, border: "1px solid #eee", borderRadius: 10 }}>
                  <div style={{ opacity: 0.85, fontSize: 13 }}>
                    Estado (backend): {typeof generateStatus === "object" ? "ok" : String(generateStatus)}
                  </div>
                </div>
              )}

              <div className="amount-input-group" style={{ marginTop: 12 }}>
                <label>Grupo</label>
                <select
                  value={generateGroupId}
                  onChange={(e) => setGenerateGroupId(e.target.value)}
                >
                  <option value="">Selecciona un grupo</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="amount-input-group" style={{ marginTop: 12 }}>
                <label>Monto base a generar (₡)</label>
                <input
                  type="number"
                  value={generateAmount}
                  onChange={(e) => setGenerateAmount(e.target.value)}
                  min="1"
                  placeholder="Ej: 50000"
                />
              </div>

              <div style={{ marginTop: 8, opacity: 0.75, fontSize: 12 }}>
                * Si tu RPC genera una cuota por estudiante activo, este monto será el “amount_due”.
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-confirm" onClick={confirmGenerate} disabled={generateLoading || loading}>
                {generateLoading ? "Generando..." : "Generar"}
              </button>
              <button className="btn-cancel-modal" onClick={() => setShowGenerateModal(false)} disabled={generateLoading || loading}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
