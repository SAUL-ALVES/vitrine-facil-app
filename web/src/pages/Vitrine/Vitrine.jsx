import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, Sparkles, MapPin, User, Star, ArrowRight, Store as StoreIcon } from 'lucide-react';
import { firebaseService } from '../../services/firebase';
import './Vitrine.css';

const PLACEHOLDER_COVER = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

export default function Vitrine() {
  const navigate = useNavigate();
  const [lojas, setLojas] = useState([]);
  const [busca, setBusca] = useState("");
  const [segmentoAtivo, setSegmentoAtivo] = useState("Todos");
  const [loading, setLoading] = useState(true);

  // Carrega as lojas (agora do Firebase)
  useEffect(() => {
    async function carregarLojas() {
      setLoading(true);
      const dados = await firebaseService.getLojas();
      
      // Mapeando dados do Firebase para encaixar no visual do novo layout
      const lojasFormatadas = dados.map(loja => ({
        ...loja,
        image: loja.imagemCapa || PLACEHOLDER_COVER, // Se o firebase não tiver capa, usa um genérico bonito
        rating: 4.8, // Dados visuais fixos pro MVP
        reviews: Math.floor(Math.random() * 100) + 10,
        location: loja.cidade || "Centro",
      }));
      
      setLojas(lojasFormatadas);
      setLoading(false);
    }
    carregarLojas();
  }, []);

  const segmentos = useMemo(() => {
    const segs = new Set(lojas.map(loja => loja.segmento || "Outros"));
    return ["Todos", ...Array.from(segs)];
  }, [lojas]);

  const lojasFiltradas = useMemo(() => {
    return lojas.filter(loja => {
      const matchBusca = (loja.nomeLoja || loja.nome || "").toLowerCase().includes(busca.toLowerCase());
      const matchSegmento = segmentoAtivo === "Todos" || (loja.segmento || "Outros") === segmentoAtivo;
      return matchBusca && matchSegmento;
    });
  }, [lojas, busca, segmentoAtivo]);

  return (
    <div className="vitrine-page fade-in">
      
      {/* Header Fixo e Transparente */}
      <header className="vitrine-header glass-effect">
        <div className="vitrine-logo">
          <div className="logo-badge-modern">VF</div>
          <span className="logo-text-modern">
            Vitrine<span className="text-orange-modern">Fácil</span>
          </span>
        </div>
        <button className="btn-lojista-outline" onClick={() => navigate('/login')}>
          Sou Lojista
        </button>
      </header>

      <main className="vitrine-main">
        
        {/* Seção Hero (Fundo Escuro) */}
        <section className="hero-section hero-dark-bg">
          <div className="hero-glow-teal"></div>
          <div className="hero-glow-orange"></div>
          
          <div className="hero-content">
            <div className="hero-pill slide-up">
              <Sparkles size={14} className="text-teal-400" />
              <span>Descubra o comércio local</span>
            </div>
            
            <h1 className="hero-title slide-up-delay-1">
              Compre de quem faz a <span className="text-gradient">diferença</span> na sua região.
            </h1>
            
            <p className="hero-subtitle slide-up-delay-2">
              Apoie pequenos empreendedores, encontre produtos únicos e fortaleça a economia do seu bairro.
            </p>
          </div>
        </section>

        {/* Barra de Pesquisa Flutuante */}
        <div className="search-container pop-in">
          <div className="search-box">
            <Search className="search-icon" size={22} />
            <input 
              type="text" 
              placeholder="O que você está procurando hoje?" 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="chips-container scrollbar-hide">
            <Compass size={20} className="chip-icon" />
            {segmentos.map((seg) => (
              <button
                key={seg}
                onClick={() => setSegmentoAtivo(seg)}
                className={`segmento-chip ${segmentoAtivo === seg ? "ativo" : ""}`}
              >
                {seg}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Resultados */}
        <section className="resultados-section">
          <div className="resultados-header">
            <h2>{busca ? "Resultados da busca" : "Lojas em destaque"}</h2>
            <p>{lojasFiltradas.length} {lojasFiltradas.length === 1 ? 'loja encontrada' : 'lojas encontradas'}</p>
          </div>

          {loading ? (
            <div className="lojas-grid skeleton-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="loja-modern-card skeleton-card">
                  <div className="skeleton-cover"></div>
                  <div className="skeleton-body">
                    <div className="skeleton-avatar"></div>
                    <div className="skeleton-text skeleton-title"></div>
                    <div className="skeleton-text skeleton-desc"></div>
                    <div className="skeleton-btn"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : lojasFiltradas.length === 0 ? (
            <div className="empty-state pop-in">
              <div className="empty-icon-wrap">
                <StoreIcon size={40} />
              </div>
              <h3>Nenhuma loja encontrada</h3>
              <p>Não encontramos resultados para "{busca}". Tente buscar com outros termos.</p>
              <button onClick={() => { setBusca(""); setSegmentoAtivo("Todos"); }}>
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="lojas-grid">
              {lojasFiltradas.map((loja, index) => (
                <article 
                  key={loja.id} 
                  className="loja-modern-card pop-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Imagem de Capa do Card */}
                  <div className="card-cover">
                    <img src={loja.image} alt={loja.nomeLoja} />
                    <div className="card-cover-overlay"></div>
                    <div className="card-rating">
                      <Star size={12} className="star-icon" />
                      {loja.rating}
                      <span>({loja.reviews})</span>
                    </div>
                  </div>

                  {/* Corpo do Card */}
                  <div className="card-body">
                    <div className="card-avatar-row">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(loja.nomeLoja)}&background=0A7B6C&color=fff&size=120&bold=true`}
                        alt={`${loja.nomeLoja} logo`}
                        className="loja-avatar-float"
                      />
                      <span className="loja-tag">{loja.segmento}</span>
                    </div>

                    <h3 className="loja-title">{loja.nomeLoja}</h3>

                    <div className="loja-meta">
                      <div className="meta-item">
                        <MapPin size={14} /> <span>{loja.location}</span>
                      </div>
                      <div className="meta-item">
                        <User size={14} /> <span>Por {loja.nome}</span>
                      </div>
                    </div>

                    <button 
                      className="btn-catalogo"
                      onClick={() => alert(`Em breve: Catálogo de ${loja.nomeLoja}`)}
                    >
                      <span>Ver Catálogo</span>
                      <div className="btn-catalogo-icon">
                        <ArrowRight size={16} />
                      </div>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}