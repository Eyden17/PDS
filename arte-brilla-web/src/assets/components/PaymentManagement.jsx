import React, { useState, useMemo } from 'react';
import '../styles/PaymentManagement.css';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([
    { id: 1, nombre: 'Juan Pérez', grupo: 'Babies (3-5 años)', cantidadOriginal: 100000, mes: 'Diciembre', pagado: false, saldoDeudor: 100000, abonos: [] },
    { id: 2, nombre: 'María García', grupo: 'Minies (6+ años)', cantidadOriginal: 50000, mes: 'Diciembre', pagado: true, saldoDeudor: 0, abonos: [{ fecha: '20/12/2025', monto: 50000 }] },
    { id: 3, nombre: 'Carlos López', grupo: 'Artes Proféticas', cantidadOriginal: 75000, mes: 'Diciembre', pagado: false, saldoDeudor: 45000, abonos: [{ fecha: '15/12/2025', monto: 30000 }] },
    { id: 4, nombre: 'Ana Martínez', grupo: 'Babies (3-5 años)', cantidadOriginal: 50000, mes: 'Diciembre', pagado: true, saldoDeudor: 0, abonos: [{ fecha: '18/12/2025', monto: 50000 }] },
    { id: 5, nombre: 'Sofia Rodríguez', grupo: 'Minies (6+ años)', cantidadOriginal: 60000, mes: 'Noviembre', pagado: false, saldoDeudor: 25000, abonos: [{ fecha: '10/11/2025', monto: 35000 }] },
  ]);

  // Filtros
  const [filterMonth, setFilterMonth] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'paid'

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showPaymentHistory, setShowPaymentHistory] = useState(null);
  const [paymentType, setPaymentType] = useState(null); // 'abono' o 'total'

  const handleAbonoClick = (payment) => {
    setSelectedPayment(payment);
    setPaymentAmount('');
    setPaymentType('abono');
    setShowPaymentModal(true);
  };

  const handlePagoTotalClick = (payment) => {
    setSelectedPayment(payment);
    setPaymentAmount(payment.saldoDeudor.toString());
    setPaymentType('total');
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    const monto = parseFloat(paymentAmount);
    if (monto > 0) {
      setPayments(payments.map(p => {
        if (p.id === selectedPayment.id) {
          const nuevoSaldo = p.saldoDeudor - monto;
          const nuevosAbonos = [...p.abonos, { 
            fecha: new Date().toLocaleDateString('es-ES'), 
            monto: monto 
          }];
          
          return {
            ...p,
            saldoDeudor: nuevoSaldo > 0 ? nuevoSaldo : 0,
            pagado: nuevoSaldo <= 0,
            abonos: nuevosAbonos
          };
        }
        return p;
      }));
      setShowPaymentModal(false);
      setSelectedPayment(null);
      setPaymentAmount('');
    }
  };

  // Filtrado de pagos
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchMonth = !filterMonth || payment.mes === filterMonth;
      const matchGroup = !filterGroup || payment.grupo === filterGroup;
      const matchName = !filterName || payment.nombre.toLowerCase().includes(filterName.toLowerCase());
      const matchStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'pending' && payment.saldoDeudor > 0) ||
        (filterStatus === 'paid' && payment.saldoDeudor === 0);
      
      return matchMonth && matchGroup && matchName && matchStatus;
    });
  }, [payments, filterMonth, filterGroup, filterName, filterStatus]);

  // Cálculos basados en pagos filtrados
  const pendingPayments = filteredPayments.filter(p => p.saldoDeudor > 0);
  const paidPayments = filteredPayments.filter(p => p.saldoDeudor === 0);
  const totalDue = pendingPayments.reduce((sum, p) => sum + p.saldoDeudor, 0);
  const totalAbonado = filteredPayments.reduce((sum, p) => sum + p.abonos.reduce((s, a) => s + a.monto, 0), 0);
  const totalOriginal = filteredPayments.reduce((sum, p) => sum + p.cantidadOriginal, 0);
  const paymentPercentage = totalOriginal > 0 ? Math.round((totalAbonado / totalOriginal) * 100) : 0;

  // Obtener meses y grupos únicos
  const months = [...new Set(payments.map(p => p.mes))];
  const groups = [...new Set(payments.map(p => p.grupo))];

  // Función para determinar el color del semáforo
  const getPaymentStatus = (payment) => {
    if (payment.saldoDeudor === 0) {
      return { status: 'paid', label: 'Pagado', color: '#4CAF50', icon: '✓' };
    } else if (payment.saldoDeudor > payment.cantidadOriginal * 0.3) {
      return { status: 'alert', label: 'Atrasado', color: '#f44336', icon: '⚠' };
    } else {
      return { status: 'partial', label: 'Abonando', color: '#ff9800', icon: '◐' };
    }
  };

  // Calcular progreso de pago por estudiante
  const getPaymentProgress = (payment) => {
    const abonado = payment.abonos.reduce((s, a) => s + a.monto, 0);
    return Math.round((abonado / payment.cantidadOriginal) * 100);
  };

  return (
    <div className="payment-management">
      <div className="management-header">
        <h2>Control Financiero</h2>
        <p className="header-subtitle">Gestión de pagos y control de cobranza</p>
      </div>

      {/* Tarjetas de Estadísticas Mejoradas */}
      <div className="payment-stats">
        <div className="stat-card stat-total">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">Total a Pagar</p>
            <p className="stat-value">₡{totalDue.toLocaleString()}</p>
            <p className="stat-meta">{pendingPayments.length} estudiantes</p>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <p className="stat-label">Deudores Activos</p>
            <p className="stat-value">{pendingPayments.length}</p>
            <p className="stat-meta">En proceso de pago</p>
          </div>
        </div>

        <div className="stat-card stat-paid">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <p className="stat-label">Saldos Pagados</p>
            <p className="stat-value">{paidPayments.length}</p>
            <p className="stat-meta">100% completado</p>
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
            <label>Por Mes</label>
            <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
              <option value="">Todos los meses</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Por Grupo</label>
            <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)}>
              <option value="">Todos los grupos</option>
              {groups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Por Nombre</label>
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
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="paid">Pagados</option>
            </select>
          </div>

          <button 
            className="btn-reset-filters"
            onClick={() => {
              setFilterMonth('');
              setFilterGroup('');
              setFilterName('');
              setFilterStatus('all');
            }}
          >
            Limpiar Filtros
          </button>
        </div>
        <p className="filters-result">Mostrando {filteredPayments.length} de {payments.length} registros</p>
      </div>

      {/* Tabla de Pagos Mejorada */}
      <div className="payment-table-section">
        <h3 className="section-title">📋 Detalle de Pagos</h3>
        <div className="payment-table-wrapper">
          <table className="payment-table">
            <thead>
              <tr>
                <th className="col-status">Estado</th>
                <th className="col-student">Estudiante</th>
                <th className="col-group">Grupo</th>
                <th className="col-month">Mes</th>
                <th className="col-original">Monto Original</th>
                <th className="col-paid">Abonado</th>
                <th className="col-pending">Por Pagar</th>
                <th className="col-progress">Progreso</th>
                <th className="col-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan="9" className="empty-message">
                    <p>No hay registros que coincidan con los filtros seleccionados</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map(payment => {
                  const status = getPaymentStatus(payment);
                  const progress = getPaymentProgress(payment);
                  const abonado = payment.abonos.reduce((s, a) => s + a.monto, 0);

                  return (
                    <tr key={payment.id} className={`payment-row ${status.status}`}>
                      <td className="col-status">
                        <div className="status-badge" style={{ borderColor: status.color }}>
                          <span className="status-icon" style={{ color: status.color }}>{status.icon}</span>
                          <span className="status-label">{status.label}</span>
                        </div>
                      </td>
                      <td className="col-student">
                        <span className="student-name">{payment.nombre}</span>
                      </td>
                      <td className="col-group">
                        <span className="group-badge">{payment.grupo}</span>
                      </td>
                      <td className="col-month">
                        <span className="month-badge">{payment.mes}</span>
                      </td>
                      <td className="col-original">
                        <span className="amount-original">₡{payment.cantidadOriginal.toLocaleString()}</span>
                      </td>
                      <td className="col-paid">
                        <span className="amount-paid">₡{abonado.toLocaleString()}</span>
                      </td>
                      <td className="col-pending">
                        <span className={`amount-pending ${payment.saldoDeudor > 0 ? 'alert' : 'paid'}`}>
                          ₡{payment.saldoDeudor.toLocaleString()}
                        </span>
                      </td>
                      <td className="col-progress">
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%`, backgroundColor: status.color }}></div>
                          </div>
                          <span className="progress-text">{progress}%</span>
                        </div>
                      </td>
                      <td className="col-actions">
                        <div className="action-buttons">
                          {payment.saldoDeudor > 0 && (
                            <>
                              <button
                                className="btn-action btn-abono"
                                onClick={() => handleAbonoClick(payment)}
                                title="Registrar abono"
                              >
                                💵
                              </button>
                              <button
                                className="btn-action btn-pago-total"
                                onClick={() => handlePagoTotalClick(payment)}
                                title="Pago total"
                              >
                                ✓
                              </button>
                            </>
                          )}
                          <button
                            className="btn-action btn-history"
                            onClick={() => setShowPaymentHistory(payment.id)}
                            title="Ver historial"
                          >
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

      {/* Modal de Pago */}
      {showPaymentModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => { setShowPaymentModal(false); setSelectedPayment(null); setPaymentType(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {paymentType === 'total' ? 'Pago Total' : 'Registrar Abono'}
              </h3>
              <button className="btn-close" onClick={() => { setShowPaymentModal(false); setSelectedPayment(null); setPaymentType(null); }}>✕</button>
            </div>

            <div className="modal-body">
              <div className="payment-details">
                <p><strong>Estudiante:</strong> {selectedPayment.nombre}</p>
                <p><strong>Mes:</strong> {selectedPayment.mes}</p>
                <p><strong>Monto Original:</strong> ₡{selectedPayment.cantidadOriginal.toLocaleString()}</p>
              </div>

              {paymentType === 'abono' ? (
                <div className="amount-input-group">
                  <label>¿Cuánto va a abonar? (₡)</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    min="1"
                    max={selectedPayment.saldoDeudor}
                    placeholder="Ingresa el monto"
                  />
                </div>
              ) : (
                <div className="amount-display">
                  <p className="amount-label">Monto a Pagar (Pago Total):</p>
                  <p className="amount-value">₡{parseFloat(paymentAmount || 0).toLocaleString()}</p>
                </div>
              )}

              <div className="payment-summary">
                <div className="summary-row">
                  <span>Saldo Deudor Actual:</span>
                  <strong>₡{selectedPayment.saldoDeudor.toLocaleString()}</strong>
                </div>
                <div className="summary-row">
                  <span>Monto a {paymentType === 'total' ? 'Pagar' : 'Abonar'}:</span>
                  <strong>₡{parseFloat(paymentAmount || 0).toLocaleString()}</strong>
                </div>
                <div className="summary-row highlight">
                  <span>Saldo Después:</span>
                  <strong>₡{Math.max(0, selectedPayment.saldoDeudor - parseFloat(paymentAmount || 0)).toLocaleString()}</strong>
                </div>
                {paymentType === 'abono' && parseFloat(paymentAmount) > selectedPayment.saldoDeudor && (
                  <div className="summary-row warning">
                    <span>⚠️ El abono excede el saldo deudor</span>
                  </div>
                )}
                {paymentType === 'total' && (
                  <div className="summary-row success">
                    <span>✓ Pagará el saldo completo</span>
                  </div>
                )}
              </div>

              {selectedPayment.abonos.length > 0 && (
                <div className="abonos-history">
                  <h4>Historial de Abonos</h4>
                  <div className="abonos-list">
                    {selectedPayment.abonos.map((abono, idx) => (
                      <div key={idx} className="abono-item">
                        <span>{abono.fecha}</span>
                        <span className="abono-monto">₡{abono.monto.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                className={paymentType === 'total' ? 'btn-confirm-total' : 'btn-confirm'}
                onClick={handleConfirmPayment}
                disabled={parseFloat(paymentAmount) <= 0 || (paymentType === 'abono' && parseFloat(paymentAmount) > selectedPayment.saldoDeudor)}
              >
                {paymentType === 'total' ? 'Confirmar Pago Total' : 'Confirmar Abono'}
              </button>
              <button
                className="btn-cancel-modal"
                onClick={() => { setShowPaymentModal(false); setSelectedPayment(null); setPaymentType(null); }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Historial de Pagos */}
      {showPaymentHistory && (
        <div className="modal-overlay" onClick={() => setShowPaymentHistory(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Historial de Abonos</h3>
              <button className="btn-close" onClick={() => setShowPaymentHistory(null)}>✕</button>
            </div>

            <div className="modal-body">
              {payments.find(p => p.id === showPaymentHistory) && (
                <div className="history-details">
                  <div className="history-summary">
                    <p><strong>Estudiante:</strong> {payments.find(p => p.id === showPaymentHistory).nombre}</p>
                    <p><strong>Monto Original:</strong> ₡{payments.find(p => p.id === showPaymentHistory).cantidadOriginal.toLocaleString()}</p>
                    <p><strong>Saldo Actual:</strong> ₡{payments.find(p => p.id === showPaymentHistory).saldoDeudor.toLocaleString()}</p>
                  </div>

                  {payments.find(p => p.id === showPaymentHistory).abonos.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>Sin abonos registrados</p>
                  ) : (
                    <div className="abonos-table">
                      <div className="abonos-header">
                        <span>Fecha</span>
                        <span>Monto</span>
                      </div>
                      {payments.find(p => p.id === showPaymentHistory).abonos.map((abono, idx) => (
                        <div key={idx} className="abonos-row">
                          <span>{abono.fecha}</span>
                          <span>₡{abono.monto.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="abonos-total">
                        <span>Total Abonado:</span>
                        <span>₡{payments.find(p => p.id === showPaymentHistory).abonos.reduce((s, a) => s + a.monto, 0).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="btn-cancel-modal"
                onClick={() => setShowPaymentHistory(null)}
                style={{ width: '100%' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
