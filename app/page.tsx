import Image from 'next/image';
import Boot from '@/components/Boot';
import Interface from '@/components/Interface';
import ShaderBackdrop from '@/components/ShaderBackdrop';
import NeuralField from '@/components/NeuralField';
import Scramble from '@/components/Scramble';
import Reveal from '@/components/Reveal';
import Pipeline from '@/components/Pipeline';
import StackMatrix from '@/components/StackMatrix';
import {
  profile,
  contact,
  metrics,
  experience,
  projects,
  education,
  certifications,
  sections,
  identity,
  uplink,
  footerNote,
} from '@/lib/data';

const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

function Head({ id }: { id: string }) {
  const s = sections.find((x) => x.id === id)!;
  return (
    <Reveal className="sec-head" as="header">
      <span className="sec-index">
        [ {s.index} ] <span className="sec-slash">/</span>
      </span>
      <h2 className="sec-title">{s.code}</h2>
      <span className="sec-human">{s.human}</span>
    </Reveal>
  );
}

export default function Page() {
  return (
    <>
      <Boot />

      {/* ---------- atmosphere ---------- */}
      <ShaderBackdrop />
      <div className="atmos" aria-hidden="true">
        <div className="atmos-grid" />
        <div className="atmos-vignette" />
        <div className="atmos-grain" />
        <div className="atmos-rules" />
      </div>

      <Interface />

      <a className="skip mono" href="#signal">
        Skip to content
      </a>

      <main className="shell">
        {/* ================= 00 · INDEX ================= */}
        <section id="index" className="hero">
          <NeuralField />

          <div className="hero-frame" aria-hidden="true">
            <i data-c="tl" />
            <i data-c="tr" />
            <i data-c="bl" />
            <i data-c="br" />
          </div>

          <div className="wrap hero-in">
            <div className="hero-top mono">
              <span className="hero-slug">
                <i className="live" /> currently
              </span>
              <span className="hero-now">{profile.status}</span>
            </div>

            <h1 className="hero-name display" aria-label={profile.name}>
              <span className="hero-line">
                <Scramble text={profile.first} waitForBoot delay={120} />
              </span>
              <span className="hero-line hero-line-2">
                <Scramble text={profile.last} waitForBoot delay={340} />
                <i className="caret" aria-hidden="true" />
              </span>
            </h1>

            <div className="hero-say">
              <p className="hero-tagline lede">{profile.tagline}</p>
              <ul className="hero-chips mono" aria-label="Focus areas">
                <li>{profile.role}</li>
                <li>{profile.degree}</li>
                <li>{profile.focus}</li>
              </ul>
            </div>

            <ul className="hero-metrics" aria-label="Highlights">
              {metrics.map((m) => (
                <li key={m.label}>
                  <span className="metric-v display">
                    {m.value}
                    <em className="mono">{m.unit}</em>
                  </span>
                  <span className="metric-l">{m.label}</span>
                  <span className="metric-n mono">{m.note}</span>
                </li>
              ))}
            </ul>
          </div>

          <a className="cue mono" href="#signal" aria-label="Scroll to about">
            <span>scroll</span>
            <i aria-hidden="true" />
          </a>
        </section>

        {/* ================= 01 · SIGNAL ================= */}
        <section id="signal" className="sec">
          <div className="wrap">
            <Head id="signal" />

            <div className="signal">
              <Reveal className="signal-id">
                <div className="portrait">
                  <Image
                    src={`${base}/akshay.webp`}
                    alt={`Portrait of ${profile.name}`}
                    width={640}
                    height={640}
                    priority={false}
                    sizes="(max-width: 900px) 60vw, 340px"
                  />
                  <span className="portrait-scan" aria-hidden="true" />
                  <span className="portrait-frame" aria-hidden="true" />
                </div>

                <dl className="idcard mono">
                  <div>
                    <dt>name</dt>
                    <dd>{profile.name}</dd>
                  </div>
                  <div>
                    <dt>role</dt>
                    <dd>{profile.role}</dd>
                  </div>
                  <div>
                    <dt>degree</dt>
                    <dd>{identity.degreeLine}</dd>
                  </div>
                  <div>
                    <dt>focus</dt>
                    <dd>{identity.focusLine}</dd>
                  </div>
                  <div>
                    <dt>status</dt>
                    <dd className="accent">
                      <i className="live" /> {identity.availability}
                    </dd>
                  </div>
                </dl>
              </Reveal>

              <div className="signal-say">
                {profile.statement.map((p, i) => (
                  <Reveal key={i} delay={i * 90} as="p">
                    <span className={i === 0 ? 'statement-lead lede' : 'body'}>{p}</span>
                  </Reveal>
                ))}

                <Reveal delay={200} className="signal-cta">
                  <a className="btn" href={`mailto:${contact.email}`}>
                    <span>Start a conversation</span>
                    <i aria-hidden="true">→</i>
                  </a>
                  <a
                    className="btn btn-ghost"
                    href={`${base}/${contact.resume}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>Résumé</span>
                    <i aria-hidden="true">↗</i>
                  </a>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 02 · DEPLOY ================= */}
        <section id="deploy" className="sec">
          <div className="wrap">
            <Head id="deploy" />

            <ol className="roles">
              {experience.map((r, ri) => (
                <Reveal key={r.org} as="li" delay={ri * 70} className="role">
                  <div className="role-when mono">
                    <span className="role-dot" data-live={r.current ? 'true' : 'false'} />
                    <span className="role-period">{r.period}</span>
                    {r.current && <span className="role-badge">active</span>}
                  </div>

                  <div className="role-main">
                    <div className="role-head">
                      <h3 className="role-org h3">{r.org}</h3>
                      <p className="role-title mono">
                        {r.title} <span className="role-kind">· {r.kind}</span>
                      </p>
                    </div>

                    <p className="role-summary lede">{r.summary}</p>

                    <ul className="role-bullets">
                      {r.bullets.map((b, i) => (
                        <li key={b.head}>
                          <span className="role-bi mono">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <h4 className="role-bh">{b.head}</h4>
                            <p className="body">{b.body}</p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <ul className="chips" aria-label={`${r.org} technologies`}>
                      {r.stack.map((t) => (
                        <li key={t} className="chip mono">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ================= 03 · BUILDS ================= */}
        <section id="builds" className="sec">
          <div className="wrap">
            <Head id="builds" />

            <div className="builds">
              {projects.map((p) => (
                <Reveal key={p.id} as="article" className="build">
                  <span className="build-ghost display" aria-hidden="true">
                    {p.index}
                  </span>

                  <div className="build-say">
                    <p className="build-kicker mono">
                      <span className="accent">{p.index}</span>
                      <span className="build-sep">/</span>
                      {p.kicker}
                      <span className="build-sep">·</span>
                      {p.date}
                    </p>

                    <h3 className="build-name h2">{p.name}</h3>
                    <p className="build-tagline lede">{p.tagline}</p>
                    <p className="build-body body">{p.body}</p>

                    <ul className="chips" aria-label={`${p.name} technologies`}>
                      {p.stack.map((t) => (
                        <li key={t} className="chip mono">
                          {t}
                        </li>
                      ))}
                    </ul>

                    <div className="build-links">
                      {p.repo ? (
                        <a className="btn btn-ghost" href={p.repo} target="_blank" rel="noreferrer">
                          <span>View repository</span>
                          <i aria-hidden="true">↗</i>
                        </a>
                      ) : (
                        <a
                          className="btn btn-ghost"
                          href={contact.github}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>{contact.githubHandle}</span>
                          <i aria-hidden="true">↗</i>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="build-diagram">
                    <p className="build-dlabel tag">Signal path</p>
                    <Pipeline steps={p.pipeline} label={`${p.name} architecture`} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 04 · STACK ================= */}
        <section id="stack" className="sec">
          <div className="wrap">
            <Head id="stack" />
            <Reveal>
              <StackMatrix />
            </Reveal>
          </div>
        </section>

        {/* ================= 05 · RECORD ================= */}
        <section id="record" className="sec">
          <div className="wrap">
            <Head id="record" />

            <div className="record">
              <div className="record-col">
                <h3 className="record-h tag">Education</h3>
                <ol className="edu">
                  {education.map((e, i) => (
                    <Reveal key={e.school} as="li" delay={i * 80} className="edu-item">
                      <div className="edu-top">
                        <h4 className="edu-school h3">{e.school}</h4>
                        <span className="edu-gpa mono">{e.gpa}</span>
                      </div>
                      <p className="edu-deg mono">
                        {e.degree}, {e.field}
                        <span className="edu-period">{e.period}</span>
                      </p>
                      {e.coursework && (
                        <ul className="chips edu-course" aria-label="Coursework">
                          {e.coursework.map((c) => (
                            <li key={c} className="chip mono">
                              {c}
                            </li>
                          ))}
                        </ul>
                      )}
                    </Reveal>
                  ))}
                </ol>
              </div>

              <div className="record-col">
                <h3 className="record-h tag">Certifications</h3>
                <ul className="certs">
                  {certifications.map((c, i) => (
                    <Reveal key={c.name} as="li" delay={i * 60}>
                      <a
                        className="cert"
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="cert-n mono">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="cert-body">
                          <span className="cert-name">{c.name}</span>
                          <span className="cert-issuer mono">{c.issuer}</span>
                        </span>
                        <span className="cert-go mono" aria-hidden="true">
                          ↗
                        </span>
                      </a>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 06 · UPLINK ================= */}
        <section id="uplink" className="sec sec-end">
          <div className="wrap">
            <Head id="uplink" />

            <div className="uplink">
              <Reveal className="uplink-say">
                <p className="uplink-lead display">
                  {uplink.leadTop}
                  <br />
                  {uplink.leadBottom}{' '}
                  <span className="accent">{uplink.leadAccent}</span>?
                </p>
                <p className="body uplink-note">{uplink.note}</p>
                <a className="btn btn-lg" href={`mailto:${contact.email}`}>
                  <span>{contact.email}</span>
                  <i aria-hidden="true">→</i>
                </a>
              </Reveal>

              <Reveal delay={120} className="uplink-term">
                <div className="term">
                  <div className="term-bar mono">
                    <span className="term-dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span>akshay@portfolio — ~</span>
                  </div>
                  <div className="term-body mono">
                    <p className="term-cmd">
                      <span className="term-user">akshay@portfolio</span>
                      <span className="term-path">~</span>
                      <span className="term-sig">%</span> contact --list
                    </p>
                    <ul className="term-out">
                      <li>
                        <span className="term-k">email</span>
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      </li>
                      <li>
                        <span className="term-k">phone</span>
                        <a href={contact.phoneHref}>{contact.phone}</a>
                      </li>
                      <li>
                        <span className="term-k">github</span>
                        <a href={contact.github} target="_blank" rel="noreferrer">
                          {contact.githubHandle}
                        </a>
                      </li>
                      <li>
                        <span className="term-k">linkedin</span>
                        <a href={contact.linkedin} target="_blank" rel="noreferrer">
                          {contact.linkedinHandle}
                        </a>
                      </li>
                      <li>
                        <span className="term-k">resume</span>
                        <a
                          href={`${base}/${contact.resume}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          akshay-merugu-resume.pdf
                        </a>
                      </li>
                    </ul>
                    <p className="term-cmd term-idle">
                      <span className="term-user">akshay@portfolio</span>
                      <span className="term-path">~</span>
                      <span className="term-sig">%</span>
                      <i className="caret" aria-hidden="true" />
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-in mono">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span className="foot-mid">{footerNote}</span>
          <a href="#index">back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
