import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { classService } from "../../services/classService";
import "../styles/ClassStudentsPage.css"; // opcional, podés reutilizar tu CSS actual

// Estilos en línea para mejorar la apariencia visual
const styles = {
  page: {
    maxWidth: 700,
    margin: "40px auto 0 auto",
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 4px 32px 0 rgba(80, 40, 120, 0.10)",
    padding: 32,
    minHeight: 500,
    fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
    borderBottom: "2px solid #e0e0f7",
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: "#4B2178",
    letterSpacing: 0.5,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  btnCancel: {
    background: "#fff",
    color: "#b23b5a",
    border: "1.5px solid #b23b5a",
    borderRadius: 8,
    padding: "8px 18px",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    marginRight: 8,
    transition: "background 0.2s, color 0.2s",
  },
  btnSave: {
    background: "linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 22px",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 2px 8px 0 rgba(123,47,242,0.10)",
    transition: "background 0.2s, color 0.2s",
  },
  filtersSection: {
    margin: "32px 0 18px 0",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  filterInput: {
    border: "1.5px solid #e0e0f7",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 16,
    width: "100%",
    outline: "none",
    marginTop: 4,
    background: "#faf8ff",
    color: "#4B2178",
    fontWeight: 500,
    boxSizing: "border-box",
  },
  btnSelectAll: {
    background: "#f3e6ff",
    color: "#7b2ff2",
    border: "1.5px solid #7b2ff2",
    borderRadius: 8,
    padding: "7px 16px",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    marginLeft: 8,
    transition: "background 0.2s, color 0.2s",
  },
  studentsList: {
    marginTop: 18,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  studentRow: {
    display: "flex",
    alignItems: "center",
    background: "#f8f6ff",
    borderRadius: 10,
    padding: "14px 18px",
    boxShadow: "0 1px 4px 0 rgba(123,47,242,0.04)",
    border: "1.5px solid #e0e0f7",
    fontSize: 17,
    fontWeight: 500,
    color: "#4B2178",
    transition: "background 0.2s, border 0.2s",
    cursor: "pointer",
  },
  studentRowChecked: {
    background: "linear-gradient(90deg, #f3e6ff 0%, #ffe6f3 100%)",
    border: "2px solid #f357a8",
    color: "#b23b5a",
  },
  studentTitle: {
    fontWeight: 700,
    fontSize: 17,
    letterSpacing: 0.2,
  },
  emptyState: {
    margin: "40px 0 0 0",
    textAlign: "center",
    color: "#b23b5a",
    fontWeight: 600,
    fontSize: 18,
  },
};

export default function ClassStudentsPage() {
  const { id: classId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [rows, setRows] = useState([]); // {student_id, identification, first_name, last_name, is_enrolled}
  const [selected, setSelected] = useState(() => new Set());
  const [q, setQ] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await classService.listStudents(classId);
      const data = res?.data?.data ?? res?.data ?? [];

      setRows(data);

      const initial = new Set();
      for (const s of data) if (s.is_enrolled) initial.add(s.student_id);
      setSelected(initial);
    } catch (e) {
      setError(e?.message || "Error cargando estudiantes");
      setRows([]);
      setSelected(new Set());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  const filtered = useMemo(() => {
    const query = (q || "").toLowerCase().trim();
    if (!query) return rows;

    return rows.filter((s) => {
      const full = `${s.first_name || ""} ${s.last_name || ""}`.toLowerCase();
      const ced = String(s.identification || "").toLowerCase();
      return full.includes(query) || ced.includes(query);
    });
  }, [rows, q]);

  const toggleOne = (studentId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  };

  const allFilteredSelected = useMemo(() => {
    if (!filtered.length) return false;
    return filtered.every((s) => selected.has(s.student_id));
  }, [filtered, selected]);

  const selectAllFiltered = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const s of filtered) next.add(s.student_id);
      return next;
    });
  };

  const unselectAllFiltered = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const s of filtered) next.delete(s.student_id);
      return next;
    });
  };

  const onSave = async () => {
    try {
      setSaving(true);
      setError("");

      console.log("Saving students", Array.from(selected));

      const ids = { student_ids: Array.from(selected) };
      console.log("Payload to send:", ids);
      await classService.saveStudents(classId, ids);

      navigate("/dashboard?section=classes");
    } catch (e) {
      setError(e?.message || "Error guardando");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <span style={styles.title}>
          <span role="img" aria-label="Estudiantes">👥</span> Estudiantes de la clase
        </span>
        <div>
          <button
            style={styles.btnCancel}
            onClick={() => navigate("/dashboard?section=classes")}
            disabled={saving || loading}
            onMouseOver={e => e.currentTarget.style.background = '#ffe6f3'}
            onMouseOut={e => e.currentTarget.style.background = '#fff'}
          >
            ✕ Cancelar
          </button>
          <button
            style={styles.btnSave}
            onClick={onSave}
            disabled={saving || loading}
          >
            {saving ? "Guardando..." : "✓ Guardar"}
          </button>
        </div>
      </div>

      {error && (
        <div style={styles.emptyState}>
          <p>⚠️ {error}</p>
        </div>
      )}

      <div style={styles.filtersSection}>
        <div style={{ display: "flex", gap: 16, alignItems: "end" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 600, color: "#7b2ff2" }}>Búsqueda</label>
            <input
              style={styles.filterInput}
              placeholder="Buscar por cédula o nombre..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div>
            {allFilteredSelected ? (
              <button
                style={styles.btnSelectAll}
                onClick={unselectAllFiltered}
                disabled={saving || loading}
                onMouseOver={e => e.currentTarget.style.background = '#ffe6f3'}
                onMouseOut={e => e.currentTarget.style.background = '#f3e6ff'}
              >
                Quitar selección (lista)
              </button>
            ) : (
              <button
                style={styles.btnSelectAll}
                onClick={selectAllFiltered}
                disabled={saving || loading}
                onMouseOver={e => e.currentTarget.style.background = '#ffe6f3'}
                onMouseOut={e => e.currentTarget.style.background = '#f3e6ff'}
              >
                Seleccionar todos (lista)
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={styles.emptyState}>
          <p>⏳ Cargando...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.emptyState}>
          <p>📭 No hay estudiantes para mostrar</p>
          <small style={{ color: "#7b2ff2", fontWeight: 400 }}>Verificá que haya estudiantes activos en el grupo y matrículas activas.</small>
        </div>
      ) : (
        <div style={styles.studentsList}>
          {filtered.map((s) => {
            const checked = selected.has(s.student_id);
            return (
              <label
                key={s.student_id}
                style={{
                  ...styles.studentRow,
                  ...(checked ? styles.studentRowChecked : {}),
                  opacity: saving ? 0.7 : 1,
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOne(s.student_id)}
                  disabled={saving}
                  style={{ marginRight: 16, width: 20, height: 20 }}
                />
                <div className="student-meta" style={{ flex: 1 }}>
                  <div style={styles.studentTitle}>
                    {s.identification} — {s.last_name} {s.first_name}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
