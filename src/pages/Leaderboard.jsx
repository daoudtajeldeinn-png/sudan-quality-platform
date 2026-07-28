import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'https://backend-lime-gamma-gf9yal9mmd.vercel.app/api';

const MEDALS = ['🥇','🥈','🥉'];
const MEDAL_COLORS = ['#d4af37','#9e9e9e','#cd7f32'];

export default function Leaderboard({ user, isRtl }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    fetch(`${API}/user/leaderboard`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setLeaders(list);
        const idx = list.findIndex(u => u.userId === user?.uid);
        if (idx !== -1) setMyRank(idx + 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const label = (ar, en) => isRtl ? ar : en;

  if (loading) return (
    <div style={{ padding:'40px', textAlign:'center', color:'#888' }}>
      <div style={{ fontSize:'32px', marginBottom:'12px' }}>⏳</div>
      <div>{label('جاري التحميل...','Loading...')}</div>
    </div>
  );

  return (
    <div style={{ padding:'24px', maxWidth:'700px', margin:'0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom:'24px' }}>
        <h2 style={{ fontSize:'22px', fontWeight:'700', color:'#0f2557', margin:'0 0 4px' }}>
          🏆 {label('لوحة الشرف','Leaderboard')}
        </h2>
        <p style={{ fontSize:'13px', color:'#888', margin:0 }}>
          {label('أعلى 10 مستخدمين من حيث نقاط XP','Top 10 users by XP points')}
        </p>
      </div>

      {/* My Rank Card */}
      {myRank && (
        <div style={{
          background:'linear-gradient(135deg,#0f2557,#1a3a7a)',
          borderRadius:'14px', padding:'16px 20px',
          marginBottom:'20px', display:'flex',
          alignItems:'center', gap:'14px', color:'white'
        }}>
          <div style={{ fontSize:'28px' }}>
            {myRank <= 3 ? MEDALS[myRank-1] : `#${myRank}`}
          </div>
          <div>
            <div style={{ fontSize:'13px', opacity:0.7 }}>
              {label('ترتيبك الحالي','Your current rank')}
            </div>
            <div style={{ fontSize:'20px', fontWeight:'700' }}>
              {label(`المركز ${myRank}`, `Rank #${myRank}`)}
            </div>
          </div>
          <div style={{ marginRight:'auto', textAlign:'center' }}>
            <div style={{ fontSize:'11px', opacity:0.7 }}>XP</div>
            <div style={{ fontSize:'22px', fontWeight:'700', color:'#f0d060' }}>
              {leaders[myRank-1]?.xp?.toLocaleString() || 0}
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      {leaders.length >= 3 && (
        <div style={{
          display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
          gap:'12px', marginBottom:'20px'
        }}>
          {[leaders[1], leaders[0], leaders[2]].map((u, i) => {
            const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const isMe = u?.userId === user?.uid;
            return (
              <div key={rank} style={{
                background: isMe ? 'linear-gradient(135deg,#0f2557,#1a3a7a)' : 'white',
                border: `2px solid ${MEDAL_COLORS[rank-1]}`,
                borderRadius:'14px', padding:'16px 12px',
                textAlign:'center',
                marginTop: rank === 1 ? '0' : '16px',
                boxShadow:`0 4px 16px ${MEDAL_COLORS[rank-1]}33`
              }}>
                <div style={{ fontSize:'28px', marginBottom:'6px' }}>{MEDALS[rank-1]}</div>
                {u?.photoURL
                  ? <img src={u.photoURL} alt="" style={{ width:'44px', height:'44px', borderRadius:'50%', objectFit:'cover', border:`2px solid ${MEDAL_COLORS[rank-1]}` }} />
                  : <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:`linear-gradient(135deg,${MEDAL_COLORS[rank-1]},#f0d060)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:'700', color:'#0f2557', margin:'0 auto' }}>
                      {(u?.displayName||'?')[0].toUpperCase()}
                    </div>
                }
                <div style={{ fontSize:'12px', fontWeight:'600', color: isMe ? 'white' : '#0f2557', marginTop:'8px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {u?.displayName || '—'}
                </div>
                <div style={{ fontSize:'13px', fontWeight:'700', color: MEDAL_COLORS[rank-1], marginTop:'2px' }}>
                  {(u?.xp||0).toLocaleString()} XP
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full List */}
      <div style={{ background:'white', borderRadius:'14px', border:'1px solid #e4e8f0', overflow:'hidden', boxShadow:'0 2px 8px rgba(15,37,87,0.06)' }}>
        {leaders.map((u, i) => {
          const rank = i + 1;
          const isMe = u.userId === user?.uid;
          return (
            <div key={u.userId || i} style={{
              display:'flex', alignItems:'center', gap:'14px',
              padding:'14px 20px',
              borderBottom: i < leaders.length-1 ? '1px solid #f0f2f7' : 'none',
              background: isMe ? 'rgba(15,37,87,0.04)' : 'transparent',
              transition:'background 0.15s'
            }}>
              {/* Rank */}
              <div style={{ width:'32px', textAlign:'center', fontSize: rank <= 3 ? '20px' : '14px', fontWeight:'700', color: rank <= 3 ? MEDAL_COLORS[rank-1] : '#aaa', flexShrink:0 }}>
                {rank <= 3 ? MEDALS[rank-1] : `${rank}`}
              </div>

              {/* Avatar */}
              {u.photoURL
                ? <img src={u.photoURL} alt="" style={{ width:'36px', height:'36px', borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
                : <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'linear-gradient(135deg,#0f2557,#1a3a7a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'700', color:'white', flexShrink:0 }}>
                    {(u.displayName||'?')[0].toUpperCase()}
                  </div>
              }

              {/* Name + Level */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'14px', fontWeight: isMe ? '700' : '500', color:'#0f2557', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {u.displayName || '—'}
                  {isMe && <span style={{ fontSize:'11px', background:'#0f2557', color:'white', borderRadius:'4px', padding:'1px 6px', marginRight:'6px' }}>{label('أنت','You')}</span>}
                </div>
                <div style={{ fontSize:'11px', color:'#888' }}>
                  {label('المستوى','Level')} {u.level || 1}
                </div>
              </div>

              {/* XP */}
              <div style={{ textAlign:'center', flexShrink:0 }}>
                <div style={{ fontSize:'15px', fontWeight:'700', color: rank <= 3 ? MEDAL_COLORS[rank-1] : '#0f2557' }}>
                  {(u.xp||0).toLocaleString()}
                </div>
                <div style={{ fontSize:'10px', color:'#aaa' }}>XP</div>
              </div>
            </div>
          );
        })}

        {leaders.length === 0 && (
          <div style={{ padding:'40px', textAlign:'center', color:'#aaa' }}>
            <div style={{ fontSize:'32px', marginBottom:'8px' }}>🏆</div>
            <div>{label('لا توجد بيانات بعد','No data yet')}</div>
          </div>
        )}
      </div>
    </div>
  );
}
