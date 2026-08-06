function Settings() {
  return (
    <main className="main">
      <div className="settings-header">
        <div>
          <p className="eyebrow">KitchenOS preferences</p>
          <h2>Settings</h2>
        </div>
      </div>

      <section className="settings-grid">
        <article className="settings-card">
          <div className="settings-card-header">
            <div>
              <p className="card-label">Security</p>
              <h3>Security PIN</h3>
            </div>
            <span className="settings-badge">Protected</span>
          </div>
          <p className="settings-description">
            The same full-screen PIN prompt protects chore deletion and front-door unlocking.
          </p>
          <p className="settings-description">
            Change it in <strong>.env.local</strong> using <strong>KITCHENOS_SECURITY_PIN</strong>, then restart KitchenOS.
          </p>
        </article>

        <article className="settings-card">
          <div className="settings-card-header">
            <div>
              <p className="card-label">Display</p>
              <h3>Wall Display</h3>
            </div>
            <span className="settings-badge">Coming soon</span>
          </div>
          <p className="settings-description">
            Brightness scheduling, screen sleep, theme controls, and kiosk settings will live here.
          </p>
        </article>

        <article className="settings-card">
          <div className="settings-card-header">
            <div>
              <p className="card-label">Connections</p>
              <h3>Integrations</h3>
            </div>
            <span className="settings-badge">Connected</span>
          </div>
          <p className="settings-description">
            Home Assistant and live weather are connected through the local KitchenOS development server.
          </p>
        </article>
      </section>
    </main>
  );
}

export default Settings;
