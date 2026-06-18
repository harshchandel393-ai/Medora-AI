import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const SEVERITY_COLORS = {
  Critical: '#B91C1C',
  High: '#DC2626',
  Medium: '#F59E0B',
  Low: '#10B981',
  Unknown: '#6B7280',
};

// ---------- Styles (Updated to Indigo/Sky-Blue theme) ----------
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(145deg, #F0F4FF 0%, #E6EEFE 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: '#1E293B',
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    background: 'linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)',
    padding: '48px 20px 40px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(79,70,229,0.25)',
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    maxWidth: '1100px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(4px)',
    color: 'white',
    padding: '6px 20px',
    borderRadius: '40px',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.5px',
    marginBottom: '16px',
    textTransform: 'uppercase',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: 'white',
    textShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  subtitle: {
    margin: 0,
    fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
    opacity: 0.92,
    color: 'white',
    maxWidth: '650px',
    marginInline: 'auto',
    fontWeight: 400,
  },

  content: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '32px 20px',
    flex: 1,
    width: '100%',
  },

  section: {
    background: 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(8px)',
    borderRadius: '24px',
    padding: '32px 28px',
    marginBottom: '28px',
    boxShadow: '0 4px 24px rgba(79,70,229,0.06), 0 1px 4px rgba(79,70,229,0.04)',
    border: '1px solid rgba(255,255,255,0.7)',
    transition: 'box-shadow 0.3s ease',
  },
  sectionTitle: {
    margin: '0 0 6px 0',
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    color: '#0F172A',
  },
  sectionSubtitle: {
    margin: '0 0 24px 0',
    color: '#64748B',
    fontSize: '0.95rem',
    lineHeight: 1.5,
  },
  code: {
    background: '#EEF2FF',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontFamily: 'monospace',
    color: '#4F46E5',
  },

  examplesRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  examplesLabel: {
    color: '#64748B',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },

  inputGroup: {
    marginBottom: '22px',
    position: 'relative',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 600,
    fontSize: '0.85rem',
    color: '#334155',
    letterSpacing: '0.2px',
  },

  suggestions: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    right: 0,
    background: 'white',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    boxShadow: '0 12px 40px rgba(79,70,229,0.12)',
    zIndex: 20,
    maxHeight: '280px',
    overflowY: 'auto',
    padding: '4px 0',
  },
  suggestionMeta: {
    color: '#64748B',
    fontSize: '0.75rem',
    fontWeight: 500,
  },

  actionBar: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    marginTop: '8px',
    flexWrap: 'wrap',
  },

  errorBox: {
    background: '#FEF2F2',
    color: '#991B1B',
    border: '1px solid #FECACA',
    padding: '14px 18px',
    borderRadius: '12px',
    marginTop: '16px',
    fontSize: '0.9rem',
  },

  summaryHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },

  tabs: {
    display: 'flex',
    gap: '4px',
    borderBottom: '2px solid #E2E8F0',
    marginBottom: '24px',
    overflowX: 'auto',
  },

  card: {
    background: '#FAFBFF',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #E2E8F0',
    borderLeft: '4px solid #4F46E5',
  },
  cardTitle: {
    margin: '0 0 16px 0',
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#0F172A',
  },
  row: {
    display: 'flex',
    gap: '12px',
    padding: '8px 0',
    borderBottom: '1px dashed #E2E8F0',
    alignItems: 'baseline',
  },
  rowLabel: {
    width: '160px',
    color: '#64748B',
    fontSize: '0.85rem',
    fontWeight: 600,
    flexShrink: 0,
  },
  rowValue: {
    flex: 1,
    color: '#0F172A',
    fontSize: '0.9rem',
  },
  list: {
    margin: '6px 0 6px 20px',
    padding: 0,
    color: '#1E293B',
    fontSize: '0.9rem',
  },

  rawBlock: {
    marginTop: '20px',
    cursor: 'pointer',
  },
  pre: {
    background: '#F1F5F9',
    padding: '16px',
    borderRadius: '12px',
    overflow: 'auto',
    fontSize: '0.8rem',
    lineHeight: 1.5,
    border: '1px solid #E2E8F0',
    color: '#0F172A',
    maxHeight: '400px',
  },

  footer: {
    textAlign: 'center',
    padding: '20px',
    color: '#94A3B8',
    fontSize: '0.8rem',
    borderTop: '1px solid #E2E8F0',
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(4px)',
    marginTop: 'auto',
  },
};

// ---------- Main Component ----------
const Dashboard = () => {
  const [disease, setDisease] = useState('');
  const [symptomsText, setSymptomsText] = useState('');
  const [medicationsText, setMedicationsText] = useState('');
  const [noteText, setNoteText] = useState('');

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');
  const [diseases, setDiseases] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/diseases`);
        const data = await res.json();
        if (!cancelled && data.success) {
          setDiseases(data.diseases || []);
        }
      } catch (err) {
        console.warn('Could not load disease list:', err.message);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const q = disease.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      return;
    }
    const matches = diseases
      .filter(d => d.disease.toLowerCase().includes(q))
      .slice(0, 8);
    setSuggestions(matches);
  }, [disease, diseases]);

  const symptoms = useMemo(
    () => symptomsText.split(/[,\n]/).map(s => s.trim()).filter(Boolean),
    [symptomsText]
  );
  const medications = useMemo(
    () => medicationsText.split(/[,\n]/).map(s => s.trim()).filter(Boolean),
    [medicationsText]
  );

  const handleAnalyze = async () => {
    if (!disease.trim() && !symptoms.length && !noteText.trim()) {
      setError('Provide at least a disease name, a symptom, or a free-text note.');
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: 'WEB-001',
          disease: disease.trim(),
          symptoms,
          medications,
          note_text: noteText.trim(),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Unknown error');
      setResults(data.data);
      setActiveTab('analysis');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResults(null);
    setError(null);
    setActiveTab('analysis');
  };

  const handleExample = (preset) => {
    if (preset === 'chest') {
      setDisease('Coronary Artery Disease');
      setSymptomsText('chest pain, shortness of breath, sweating, palpitations');
      setMedicationsText('Lisinopril 10mg, Aspirin 81mg, Atorvastatin 80mg');
      setNoteText(
        '58-year-old male with crushing chest pain radiating to the left arm, ' +
        'shortness of breath and diaphoresis for the past hour. History of ' +
        'hypertension and hyperlipidemia.'
      );
    } else if (preset === 'diabetes') {
      setDisease('Type 2 Diabetes');
      setSymptomsText('fatigue, frequent urination, excessive thirst, blurred vision');
      setMedicationsText('Metformin 1000mg');
      setNoteText('Patient complains of polyuria, polydipsia and weight changes for 2 months.');
    } else if (preset === 'symptoms_only') {
      setDisease('');
      setSymptomsText('fever, cough, shortness of breath, fatigue');
      setMedicationsText('');
      setNoteText('');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header} className="animate-fade-up">
        <div style={styles.headerContent}>
          <span style={styles.badge} className="pulse-badge">
            AI-Powered · ML-Driven
          </span>
          <h1 style={styles.title}>Medora AI</h1>
          <p style={styles.subtitle}>
            Multi-agent disease → risk → medication recommender (Random Forest + Gradient Boosting + KMeans)
          </p>
        </div>
      </header>

      <main style={styles.content}>
        {/* Input Section - Entrance Animation */}
        <section style={styles.section} className="animate-fade-up delay-100">
          <h2 style={styles.sectionTitle}>Patient Input</h2>
          <p style={styles.sectionSubtitle}>
            Provide a disease, a list of symptoms, or a free-text note. The system loads its knowledge from
            <code style={styles.code}> data/disease_dataset.csv</code> and infers the rest with trained models.
          </p>

          <div style={styles.examplesRow}>
            <span style={styles.examplesLabel}>Try:</span>
            <button onClick={() => handleExample('chest')} className="example-btn">
              Chest pain preset
            </button>
            <button onClick={() => handleExample('diabetes')} className="example-btn">
              Diabetes preset
            </button>
            <button onClick={() => handleExample('symptoms_only')} className="example-btn">
              Symptoms only
            </button>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Disease (optional, exact name from dataset gives best results)</label>
            <input
              type="text"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              className="input-field"
              placeholder="e.g. Hypertension, Type 2 Diabetes, Pneumonia..."
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <div style={styles.suggestions} className="suggestions-dropdown">
                {suggestions.map(s => (
                  <button
                    key={s.disease}
                    className="suggestion-item"
                    onClick={() => {
                      setDisease(s.disease);
                      setSuggestions([]);
                    }}
                  >
                    <span>{s.disease}</span>
                    <span style={styles.suggestionMeta}>
                      {s.specialty} · risk {s.risk_score} · {s.severity}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Symptoms (comma- or newline-separated)</label>
            <textarea
              value={symptomsText}
              onChange={(e) => setSymptomsText(e.target.value)}
              className="input-field"
              placeholder="e.g. fever, cough, shortness of breath, fatigue"
              rows={3}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Current Medications (comma- or newline-separated)</label>
            <textarea
              value={medicationsText}
              onChange={(e) => setMedicationsText(e.target.value)}
              className="input-field"
              placeholder="e.g. Lisinopril 10mg, Aspirin 81mg"
              rows={2}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Free-text clinical note (optional, will be parsed for symptoms)</label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="input-field"
              style={{ minHeight: '110px' }}
              placeholder="Free-form description of the patient presentation..."
            />
          </div>

          <div style={styles.actionBar}>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="primary-btn shimmer-on-hover"
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Analyzing…
                </>
              ) : (
                'Run Multi-Agent Analysis'
              )}
            </button>
            {results && (
              <button onClick={handleClear} className="secondary-btn">
                Clear
              </button>
            )}
          </div>

          {error && (
            <div style={styles.errorBox} className="animate-fade-up">
              <strong>Error:</strong> {error}
            </div>
          )}
        </section>

        {results && <ResultsView results={results} activeTab={activeTab} setActiveTab={setActiveTab} />}
      </main>

      <footer style={styles.footer}>
        <p>Trained from <code>data/disease_dataset.csv</code> · Backend: Flask + scikit-learn</p>
      </footer>
    </div>
  );
};

// ---------- ResultsView with Staggered Animations ----------
const ResultsView = ({ results, activeTab, setActiveTab }) => {
  const analysis = results.workflow_stage_1_analysis || {};
  const risks = results.workflow_stage_2_risks || {};
  const interactions = results.workflow_stage_3_interactions || {};
  const recs = results.workflow_stage_4_recommendations || {};

  const primary = analysis.primary_disease || {};
  const riskLevel = risks.risk_level || 'Unknown';
  const severityColor = SEVERITY_COLORS[riskLevel] || SEVERITY_COLORS.Unknown;

  return (
    <section style={styles.section} className="animate-fade-up delay-200">
      <h2 style={styles.sectionTitle}>Analysis Results</h2>

      {/* Staggered Summary Cards */}
      <div style={styles.summaryHeader}>
        <div className="animate-fade-up delay-100" style={{ width: '100%' }}>
          <SummaryCard
            label="Predicted disease"
            value={primary.disease || '—'}
            sub={primary.specialty || ''}
            color="#4F46E5"
          />
        </div>
        <div className="animate-fade-up delay-200" style={{ width: '100%' }}>
          <SummaryCard
            label="Risk score"
            value={risks.risk_score != null ? `${risks.risk_score} / 100` : '—'}
            sub={riskLevel}
            color={severityColor}
          />
        </div>
        <div className="animate-fade-up delay-300" style={{ width: '100%' }}>
          <SummaryCard
            label="Urgency"
            value={risks.urgency || '—'}
            sub={risks.severity || ''}
            color={severityColor}
          />
        </div>
        <div className="animate-fade-up delay-400" style={{ width: '100%' }}>
          <SummaryCard
            label="Confidence"
            value={`${Math.round((risks.confidence || 0) * 100)}%`}
            sub="risk detector"
            color="#0EA5E9"
          />
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {[
          { id: 'analysis', label: 'Clinical Analysis' },
          { id: 'risk', label: 'Risk Assessment' },
          { id: 'drugs', label: 'Drug Safety' },
          { id: 'recommend', label: 'Medication & Tests' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="tab-btn"
            style={{
              borderBottomColor: activeTab === tab.id ? '#4F46E5' : 'transparent',
              color: activeTab === tab.id ? '#4F46E5' : '#64748B',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content with animation wrapper */}
      <div className="tab-content-wrapper">
        <div className="tab-content-inner">
          {activeTab === 'analysis' && (
            <Card title="Clinical Analysis">
              <Row label="Symptoms identified" value={(analysis.symptoms_identified || []).join(', ') || '—'} />
              <Row label="Primary disease" value={primary.disease ? `${primary.disease} (${primary.specialty})` : '—'} />
              {primary.description && <Row label="Description" value={primary.description} />}
              <Row label="Model" value={analysis.model_used || '—'} />
              {analysis.alternative_diseases && analysis.alternative_diseases.length > 0 && (
                <div>
                  <strong>Alternative hypotheses:</strong>
                  <ul style={styles.list}>
                    {analysis.alternative_diseases.map(d => (
                      <li key={d.disease}>
                        {d.disease} — {(d.probability * 100).toFixed(1)}% (risk {d.risk_score})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.cluster_related_diseases && analysis.cluster_related_diseases.length > 0 && (
                <div>
                  <strong>Cluster-related diseases (KMeans):</strong>
                  <p>{analysis.cluster_related_diseases.join(', ')}</p>
                </div>
              )}
              {analysis.disease_lookup && analysis.disease_lookup.found && (
                <Row label="Lookup" value={`${analysis.disease_lookup.disease} found in dataset (severity ${analysis.disease_lookup.severity})`} />
              )}
              {analysis.disease_lookup && analysis.disease_lookup.found === false && (
                <Row label="Lookup" value={`"${analysis.disease_lookup.query}" not found in dataset — using symptom model only`} />
              )}
              {analysis.patient_age && <Row label="Patient age" value={analysis.patient_age} />}
              {analysis.patient_gender && <Row label="Patient gender" value={analysis.patient_gender} />}
            </Card>
          )}

          {activeTab === 'risk' && (
            <Card title="Risk Assessment">
              <Row label="Risk score" value={`${risks.risk_score || 0} / 100`} />
              <Row label="Risk level" value={risks.risk_level} />
              <Row label="Urgency" value={risks.urgency} />
              <Row label="Severity (dataset)" value={risks.severity || '—'} />
              <Row label="Rationale" value={risks.rationale || '—'} />
              <Row label="Confidence" value={`${Math.round((risks.confidence || 0) * 100)}%`} />
              <div>
                <strong>Critical flags:</strong>
                <ul style={styles.list}>
                  {(risks.critical_flags || []).map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </Card>
          )}

          {activeTab === 'drugs' && (
            <Card title="Drug Safety">
              <Row label="Status" value={interactions.overall_status || '—'} />
              <Row label="Medications reviewed" value={(interactions.medications_reviewed || []).join(', ') || '—'} />
              <Row label="Total interactions" value={interactions.total_interactions ?? 0} />
              {(interactions.interactions_found || []).length > 0 ? (
                <ul style={styles.list}>
                  {interactions.interactions_found.map((i, idx) => (
                    <li key={idx}>
                      <strong>{i.severity}:</strong> {i.drug_1} + {i.drug_2} → {i.effect}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No major interactions detected.</p>
              )}
            </Card>
          )}

          {activeTab === 'recommend' && (
            <Card title="Medication & Test Recommendations">
              <Row label="Primary disease" value={recs.primary_disease || '—'} />
              <Row label="Specialty" value={recs.specialty || '—'} />
              {recs.description && <Row label="Description" value={recs.description} />}
              <div>
                <strong>Suggested medications (from dataset):</strong>
                <ul style={styles.list}>
                  {(recs.suggested_medications || []).map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
              <div>
                <strong>Suggested tests (from dataset):</strong>
                <ul style={styles.list}>
                  {(recs.suggested_tests || []).map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
              <Row label="Outcome prediction" value={recs.outcome_prediction || '—'} />
              <div>
                <strong>Monitoring plan:</strong>
                <ul style={styles.list}>
                  {(recs.monitoring_plan || []).map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
              <Row label="Follow-up" value={recs.follow_up || '—'} />
            </Card>
          )}
        </div>
      </div>

      <details style={styles.rawBlock}>
        <summary style={{ fontWeight: 600, color: '#0F172A' }}>Show raw JSON response</summary>
        <pre style={styles.pre}>{JSON.stringify(results, null, 2)}</pre>
      </details>
    </section>
  );
};

// ---------- Helper Components (unchanged) ----------
const Card = ({ title, children }) => (
  <div style={styles.card}>
    <h3 style={styles.cardTitle}>{title}</h3>
    {children}
  </div>
);

const Row = ({ label, value }) => (
  <div style={styles.row}>
    <span style={styles.rowLabel}>{label}</span>
    <span style={styles.rowValue}>{value}</span>
  </div>
);

const SummaryCard = ({ label, value, sub, color }) => (
  <div className="summary-card" style={{ borderTop: `4px solid ${color}` }}>
    <div style={{ ...styles.summaryValue, color }}>{value}</div>
    <div style={styles.summaryLabel}>{label}</div>
    {sub && <div style={styles.summarySub}>{sub}</div>}
  </div>
);

export default Dashboard;