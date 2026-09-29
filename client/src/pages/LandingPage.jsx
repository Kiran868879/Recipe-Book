import { Link } from 'react-router-dom';

const categories = [
  ['Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=85'],
  ['Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=85'],
  ['Salads', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=85'],
  ['Pasta', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=85'],
  ['Lunch', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=85'],
  ['Desserts', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=85'],
];

export default function LandingPage() {
  return (
    <main className="landing-page editorial-home">
      <div className="landing-ambient" aria-hidden="true">
        <span className="ambient-badge ambient-badge-one">Chef</span>
        <span className="ambient-badge ambient-badge-two">Cooking</span>
        <span className="ambient-badge ambient-badge-three">Kitchen</span>
        <div className="ambient-photo ambient-photo-one" />
        <div className="ambient-photo ambient-photo-two" />
        <div className="ambient-photo ambient-photo-three" />
        <div className="ambient-photo ambient-photo-four" />
      </div>

      <nav className="landing-nav">
        <Link className="brand-link editorial-brand" to="/"><span className="brand-mark" aria-hidden="true">RB</span> Flavor Haven</Link>
        <div className="landing-nav-links">
          <a href="#menu">Menu</a>
          <a href="#story">Our story</a>
          <a href="#categories">Collections</a>
        </div>
        <div className="landing-nav-actions">
          <Link className="landing-login" to="/login">Sign in</Link>
          <Link className="primary-button editorial-button" to="/register">Join the table <span aria-hidden="true">-&gt;</span></Link>
        </div>
      </nav>

      <section className="editorial-hero" id="menu">
        <div className="editorial-hero-copy">
          <p className="eyebrow">The daily table / Est. 2026</p>
          <h1>Good food<br /><em>lives here.</em></h1>
          <p className="landing-intro">A place for recipes with a little more soul. Save what you love, find your next favorite, and make every meal feel like an occasion.</p>
          <div className="landing-actions">
            <Link className="primary-button editorial-button" to="/recipes">Explore recipes <span aria-hidden="true">-&gt;</span></Link>
            <a className="landing-secondary-link" href="#categories">Browse collections</a>
          </div>
        </div>
        <div className="hero-photo-wrap">
          <img className="hero-photo" src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=90" alt="A warm restaurant dining room" />
          <div className="hero-photo-note"><span>New season</span><strong>Fresh ideas,<br />served daily.</strong></div>
          <span className="hero-scroll">Scroll to explore <b>↓</b></span>
        </div>
      </section>

      <section className="promise-row" id="story" aria-label="Why choose Flavor Haven">
        <p className="section-kicker">Why choose us?</p>
        <div className="promise-grid">
          {[
            ['01', 'Unforgettable cuisine', 'Thoughtful recipes made for real life.'],
            ['02', 'Find your flavor', 'A growing collection for every kind of craving.'],
            ['03', 'Make it yours', 'Save, remix, and return to the dishes you love.'],
          ].map(([number, title, description]) => (
            <article key={number} className="promise-item">
              <span className="landing-feature-number">{number}</span>
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="category-section" id="categories">
        <div className="section-heading editorial-heading">
          <div><p className="section-kicker">From our kitchen</p><h2>Our regular food</h2></div>
          <Link className="landing-secondary-link" to="/recipes">View all recipes -&gt;</Link>
        </div>
        <div className="category-grid">
          {categories.map(([name, image]) => (
            <Link className="category-tile" to="/recipes" key={name}>
              <img src={image} alt={name} />
              <span>{name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="editorial-story">
        <div className="story-photo"><img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1100&q=85" alt="Chef preparing a meal" /></div>
        <div className="story-copy">
          <p className="section-kicker">The Flavor Haven journal</p>
          <h2>Every recipe has a story worth sharing.</h2>
          <p>From a weeknight classic to the dish you make when friends come over, Flavor Haven keeps your best ideas in one beautiful, useful place.</p>
          <Link className="primary-button editorial-button" to="/register">Build your recipe shelf <span aria-hidden="true">-&gt;</span></Link>
        </div>
      </section>

      <footer className="editorial-footer">
        <Link className="brand-link editorial-brand" to="/"><span className="brand-mark" aria-hidden="true">RB</span> Flavor Haven</Link>
        <span>Recipes for the beautifully hungry.</span>
        <Link to="/login">Sign in -&gt;</Link>
      </footer>
    </main>
  );
}