import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../pages/AcademicInfo.css';

function truncate(text, length = 140) {
  if (!text) return '';
  return text.length > length ? text.slice(0, length).trim() + '…' : text;
}

export default function Scholarship() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    axios.get('/api/academic/scholarship')
      .then(res => { if (mounted) setItems(res.data || []); })
      .catch(err => console.error(err))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  const openModal = (item) => { setSelected(item); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setSelected(null); };

  return (
    <div className="nested-card">
      <div className="nested-card-inner">
        
        {loading ? <p>Loading...</p> : (
          items.length === 0 ? (
            <p>No scholarship information available.</p>
          ) : (
            items.map(it => (
              <div key={it.id} className="nested-item" role="button" tabIndex={0}
                   onClick={() => openModal(it)} onKeyDown={(e) => e.key === 'Enter' && openModal(it)}>
                <h4>{it.title}</h4>
                <p>{truncate(it.content, 140)}</p>
                {it.created_at && <div className="item-footer">{new Date(it.created_at).toLocaleDateString()}</div>}
              </div>
            ))
          )
        )}

        {modalOpen && selected && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
              <h2 id="modal-title">{selected.title}</h2>
              <div className="modal-body">{selected.content}</div>
              {selected.created_at && <div className="modal-dates" style={{ marginTop: 12 }}><span>{new Date(selected.created_at).toLocaleDateString()}</span></div>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
