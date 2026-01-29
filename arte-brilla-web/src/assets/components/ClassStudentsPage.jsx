import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { classService } from "../../services/classService";
import "../styles/ClassStudentsPage.css"; // opcional, podés reutilizar tu CSS actual

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

      navigate("/admin?section=classes");
    } catch (e) {
      setError(e?.message || "Error guardando");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="class-students-page">
      <div className="management-header">
        <h2>👥 Estudiantes de la clase</h2>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-cancel" onClick={() => navigate("/admin?section=classes")} disabled={saving || loading}>
            ✕ Cancelar
          </button>
          <button className="btn-submit" onClick={onSave} disabled={saving || loading}>
            {saving ? "Guardando..." : "✓ Guardar"}
          </button>
        </div>
      </div>

      {error && (
        <div className="empty-state">
          <p>⚠️ {error}</p>
        </div>
      )}

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Búsqueda</label>
            <input
              className="filter-input"
              placeholder="Buscar por cédula o nombre..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="filter-group" style={{ display: "flex", alignItems: "end", gap: 8 }}>
            {allFilteredSelected ? (
              <button className="btn-reset-filters" onClick={unselectAllFiltered} disabled={saving || loading}>
                Quitar selección (lista)
              </button>
            ) : (
              <button className="btn-reset-filters" onClick={selectAllFiltered} disabled={saving || loading}>
                Seleccionar todos (lista)
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>⏳ Cargando...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>📭 No hay estudiantes para mostrar</p>
          <small>Verificá que haya estudiantes activos en el grupo y matrículas activas.</small>
        </div>
      ) : (
        <div className="students-list">
          {filtered.map((s) => {
            const checked = selected.has(s.student_id);
            return (
              <label key={s.student_id} className={`student-row ${checked ? "checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOne(s.student_id)}
                  disabled={saving}
                />
                <div className="student-meta">
                  <div className="student-title">
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
