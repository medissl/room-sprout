import React from 'react';
import { Logo } from './components/ui';
import { roomImage, products } from './data';
import './landing.css';

function uri(asset: { uri?: string } | string) {
  return typeof asset === 'string' ? asset : asset.uri;
}

export default function Landing() {
  return (
    <div className="landing">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a href="/" aria-label="RoomSprout home">
          <Logo />
        </a>
        <a className="nav-link" href="/studio">
          Try RoomSprout
        </a>
      </header>
      <main id="main">
        <section className="hero">
          <div className="hero-heading">
            <h1>
              Your room.
              <br />
              <span>More you.</span>
            </h1>
            <div className="hero-action">
              <p>
                Fresh room ideas.
                <br />
                Your style. Your budget.
              </p>
              <a className="primary-link" href="/studio">
                Explore the prototype
              </a>
              <span className="availability">iOS & Android coming later.</span>
            </div>
          </div>
          <div className="room-photo">
            <img
              src={uri(roomImage)}
              alt="Sage bedroom with cream linen, warm wood, and afternoon light"
              fetchPriority="high"
            />
          </div>
        </section>
        <section className="details-section">
          <div className="details-copy">
            <h2>
              A softer light.
              <br />A new favorite corner.
            </h2>
            <p>Little changes that make a room yours.</p>
            <a className="text-link" href="/studio/finds">
              Find the finishing touches
            </a>
          </div>
          <div className="object-large">
            <img src={uri(products[0].image)} alt="Pleated ceramic lamp concept" loading="lazy" />
            <span>A warmer evening.</span>
          </div>
          <div className="object-small">
            <img src={uri(products[1].image)} alt="Sage cotton throw concept" loading="lazy" />
            <span>A softer landing.</span>
          </div>
        </section>
        <section className="closing">
          <h2>
            Start with the room
            <br />
            you already have.
          </h2>
          <a className="primary-link" href="/studio">
            Make it yours
          </a>
        </section>
        <details className="prototype-note">
          <summary>About this prototype</summary>
          <p>
            Sample makeovers and decor ideas. Photos stay on your device. Store links search for
            similar items; prices are estimates. Live AI and app downloads aren’t available yet.
          </p>
        </details>
      </main>
      <footer className="site-footer">
        <Logo small />
        <span>Your room. More you.</span>
      </footer>
    </div>
  );
}
