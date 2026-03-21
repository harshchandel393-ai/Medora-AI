import React, { useState, useEffect } from 'react';
import './App.css';

const Dashboard = () => {
  const [noteText, setNoteText] = useState(`Patient: John Doe, 58M
Chief Complaint: Chest pain and shortness of breath

HPI: 2 days of intermittent chest pain, worse with exertion.
Associated with dyspnea and diaphoresis.

PMH: Hypertension (10 years), Type 2 DM (5 years)

Vital Signs: BP 160/100, HR 105, RR 22, O2 Sat 94%

Physical Exam: Anxious, regular rate and rhythm, lungs clear.

Assessment: Acute coronary syndrome vs anxiety.`);

  const [medications, setMedications] = useState('Lisinopril 10mg, Metformin 1000mg, Aspirin 81mg');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: 'DEMO-001',
          note_text: noteText,
          medications: medications.split(',').map(m => m.trim()).filter(m => m)
        })
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.data);
        setActiveTab('analysis');
      } else {
        setError(data.error || 'Error processing note');
      }
    } catch (err) {
      setError(`Connection error: ${err.message}`);
      console.log('Backend not running, showing demo results');
      
      setResults({
        patient_id: 'DEMO-001',
        workflow_stage_1_analysis: {
          raw: '- Chief Complaint: Chest pain and dyspnea\n- Conditions: Hypertension, Type 2 Diabetes\n- Severity: High'
        },
        workflow_stage_2_risks: {
          raw: 'CRITICAL FLAGS:\n- Elevated BP: 160/100\n- Low O2: 94%\n- Urgency Level: HIGH',
          risk_level: 'HIGH'
        },
        workflow_stage_3_interactions: {
          raw: '- No major interactions detected\n- Status: Safe'
        },
        workflow_stage_4_recommendations: {
          raw: '- Tests: ECG, Troponin, Chest X-ray\n- Treatment: Aspirin, Beta-blocker\n- Monitoring: Continuous'
        },
        tools_invoked: 12
      });
      setActiveTab('analysis');
    }
    setLoading(false);
  };

  const handleClearResults = () => {
    setResults(null);
    setError(null);
    setActiveTab('analysis');
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        textarea:focus {
          outline: none;
          border-color: #10B981;
          background: white;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        button:hover {
          transform: translateY(-2px);
        }

        button:active {
          transform: translateY(0);
        }
      `}</style>

      <div style={{...styles.header, animation: loaded ? 'fadeInDown 0.6s ease-out' : 'none'}}>
        <div style={styles.headerContent}>
          <div style={styles.badgeGroup}>
            <span style={styles.badge}>AI-Powered</span>
          </div>
          <h1 style={styles.title}>Clinical Intelligence</h1>
          <p style={styles.subtitle}>Multi-Agent Analysis System for Modern Healthcare</p>
        </div>
        <div style={styles.headerDecor}></div>
      </div>

      <div style={styles.content}>
        <div style={{...styles.section, animation: loaded ? 'fadeInUp 0.7s ease-out 0.1s both' : 'none'}}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Clinical Note Analysis</h2>
              <p style={styles.sectionSubtitle}>Enter patient information for comprehensive AI analysis</p>
            </div>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Clinical Note</label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              style={styles.textarea}
              placeholder="Enter clinical note with patient details, vitals, and assessment..."
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Current Medications</label>
            <textarea
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              style={{ ...styles.textarea, minHeight: '80px' }}
              placeholder="Enter medications separated by commas..."
            />
          </div>

          <div style={styles.actionBar}>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.85 : 1,
              }}
            >
              {loading ? 'Analyzing...' : 'Analyze Patient'}
            </button>
            {results && (
              <button onClick={handleClearResults} style={styles.secondaryButton}>
                Clear Results
              </button>
            )}
          </div>

          {error && (
            <div style={styles.errorBox}>
              <div>
                <strong>Demo Mode Active</strong>
                <p style={{margin: '4px 0 0 0'}}>{error}</p>
              </div>
            </div>
          )}
        </div>

        {results && (
          <div style={{...styles.section, animation: 'fadeInUp 0.7s ease-out 0.2s both'}}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Analysis Results</h2>
            </div>
            
            <div style={styles.agentFlow}>
              {[
                { name: 'Clinical\nAnalyzer', color: '#10B981' },
                { name: 'Risk\nDetector', color: '#EF4444' },
                { name: 'Drug\nInteractions', color: '#3B82F6' },
                { name: 'Recommendation\nEngine', color: '#F59E0B' }
              ].map((agent, i) => (
                <div key={agent.name} style={styles.agentFlowItem}>
                  <div style={{ ...styles.agentBox, background: agent.color, animation: `fadeInUp 0.6s ease-out ${0.3 + i * 0.1}s both` }}>
                    {agent.name}
                  </div>
                  {i < 3 && <div style={styles.arrow}>→</div>}
                </div>
              ))}
            </div>

            <div style={styles.tabsContainer}>
              <div style={styles.tabs}>
                {[
                  { id: 'analysis', label: 'Clinical Analysis' },
                  { id: 'risk', label: 'Risk Assessment' },
                  { id: 'drugs', label: 'Drug Interactions' },
                  { id: 'recommend', label: 'Recommendations' }
                ].map((tab, idx) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      ...styles.tab,
                      borderBottomColor: activeTab === tab.id ? '#10B981' : 'transparent',
                      color: activeTab === tab.id ? '#10B981' : '#6B7280',
                      animation: `fadeInUp 0.6s ease-out ${0.4 + idx * 0.05}s both`
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.tabContent}>
              {activeTab === 'analysis' && (
                <ResultCard title="Clinical Findings" data={results.workflow_stage_1_analysis} />
              )}
              {activeTab === 'risk' && (
                <ResultCard title="Risk Assessment" data={results.workflow_stage_2_risks} />
              )}
              {activeTab === 'drugs' && (
                <ResultCard title="Drug Safety" data={results.workflow_stage_3_interactions} />
              )}
              {activeTab === 'recommend' && (
                <ResultCard title="Clinical Recommendations" data={results.workflow_stage_4_recommendations} />
              )}
            </div>

            <div style={styles.summaryGrid}>
              <div style={styles.summaryCard}>
                <div style={styles.summaryValue}>{results.tools_invoked}</div>
                <div style={styles.summaryLabel}>Tools Invoked</div>
              </div>
              <div style={styles.summaryCard}>
                <div style={styles.summaryValue}>{results.execution_log?.length || 4}</div>
                <div style={styles.summaryLabel}>Agents Executed</div>
              </div>
              <div style={styles.summaryCard}>
                <div style={styles.summaryValue}>✓</div>
                <div style={styles.summaryLabel}>Status Complete</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <p>MedGemma Impact Challenge | Healthcare AI Innovation</p>
      </div>
    </div>
  );
};

const ResultCard = ({ title, data }) => (
  <div style={styles.card}>
    <h3 style={styles.cardTitle}>{title}</h3>
    <pre style={styles.pre}>{JSON.stringify(data, null, 2)}</pre>
  </div>
);

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
    fontFamily: "'Poppins', sans-serif",
    margin: 0,
    padding: 0,
  },
  header: {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: 'white',
    padding: '60px 20px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  },
  headerDecor: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '500px',
    height: '100%',
    opacity: 0.1,
    background: 'radial-gradient(circle, white 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  badgeGroup: {
    marginBottom: '16px',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    backdropFilter: 'blur(10px)',
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '48px',
    fontWeight: '700',
    fontFamily: "'Playfair Display', serif",
    letterSpacing: '-1px',
  },
  subtitle: {
    margin: 0,
    fontSize: '16px',
    opacity: 0.95,
    letterSpacing: '0.3px',
    fontWeight: '400',
  },
  content: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  section: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    marginBottom: '28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    border: '1px solid rgba(16,185,129,0.1)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '28px',
    marginTop: 0,
    marginBottom: '8px',
    color: '#1F2937',
    fontWeight: '700',
    fontFamily: "'Playfair Display', serif",
  },
  sectionSubtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#6B7280',
    fontWeight: '400',
  },
  inputGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px',
    letterSpacing: '0.3px',
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    border: '1.5px solid #E5E7EB',
    borderRadius: '12px',
    fontFamily: "'Courier New', monospace",
    fontSize: '13px',
    lineHeight: '1.6',
    boxSizing: 'border-box',
    minHeight: '120px',
    resize: 'vertical',
    transition: 'all 0.3s ease',
    backgroundColor: '#FAFBFC',
  },
  actionBar: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginTop: '32px',
  },
  button: {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
  },
  secondaryButton: {
    background: '#F3F4F6',
    color: '#6B7280',
    border: '1.5px solid #E5E7EB',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  errorBox: {
    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    border: '1.5px solid #FCD34D',
    color: '#92400E',
    padding: '16px',
    borderRadius: '12px',
    marginTop: '24px',
    fontSize: '14px',
    display: 'flex',
    gap: '12px',
  },
  agentFlow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    padding: '32px 24px',
    background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
    borderRadius: '14px',
    marginBottom: '32px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  agentFlowItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  agentBox: {
    width: '110px',
    padding: '16px 12px',
    color: 'white',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'pre-wrap',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '90px',
  },
  arrow: {
    fontSize: '20px',
    color: '#10B981',
    fontWeight: 'bold',
  },
  tabsContainer: {
    marginBottom: '28px',
  },
  tabs: {
    display: 'flex',
    borderBottom: '2px solid #E5E7EB',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '0',
  },
  tab: {
    background: 'none',
    border: 'none',
    padding: '14px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#6B7280',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    borderBottom: '3px solid transparent',
    whiteSpace: 'nowrap',
  },
  tabContent: {
    marginBottom: '28px',
    animation: 'fadeInUp 0.4s ease-out',
  },
  card: {
    background: '#F9FAFB',
    padding: '20px',
    borderRadius: '12px',
    borderLeft: '4px solid #10B981',
    border: '1px solid #E5E7EB',
    borderLeftWidth: '4px',
    borderLeftColor: '#10B981',
  },
  cardTitle: {
    margin: '0 0 16px 0',
    color: '#1F2937',
    fontSize: '16px',
    fontWeight: '700',
  },
  pre: {
    background: 'white',
    padding: '14px',
    borderRadius: '8px',
    overflow: 'auto',
    fontSize: '12px',
    lineHeight: '1.5',
    margin: 0,
    border: '1px solid #E5E7EB',
    color: '#374151',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginTop: '32px',
  },
  summaryCard: {
    background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #BBEF63',
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#10B981',
    marginBottom: '8px',
  },
  summaryLabel: {
    fontSize: '13px',
    color: '#059669',
    fontWeight: '600',
    letterSpacing: '0.2px',
  },
  footer: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#6B7280',
    fontSize: '14px',
    background: 'rgba(16,185,129,0.05)',
    borderTop: '1px solid rgba(16,185,129,0.1)',
  },
};

export default Dashboard;