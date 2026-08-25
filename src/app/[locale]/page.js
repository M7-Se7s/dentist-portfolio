import { Link } from "../../i18n/routing";
import Image from "next/image";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import { getTranslations } from "next-intl/server";
import ViewTracker from "./ViewTracker";
import DownloadCvButton from "@/components/DownloadCvButton";

const ClientImageSlider = dynamic(
  () => import("@/components/ClientImageSlider"),
  {
    loading: () => (
      <div style={{ width: "100%", height: "100%", background: "#E2E8F0" }} />
    ),
  },
);

export const dynamicParams = true;
export const revalidate = 60;

export default async function Home({ params }) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const tHero = await getTranslations({ locale, namespace: "Hero" });
  const tProfile = await getTranslations({ locale, namespace: "Profile" });
  const tCases = await getTranslations({ locale, namespace: "Cases" });
  const tContact = await getTranslations({ locale, namespace: "Contact" });

  let profile = null;
  let cvData = null;
  let settings = null;
  let recentCases = [];

  let dbCategories = [];

  try {
    const [profileSnap, cvSnap, settingsSnap, casesSnapshot, categoriesSnap] =
      await Promise.all([
        getDoc(doc(db, "content", "profile")),
        getDoc(doc(db, "content", "cv")),
        getDoc(doc(db, "settings", "global")),
        getDocs(collection(db, "cases")),
        getDocs(query(collection(db, "categories"), orderBy("nameEn", "asc"))),
      ]);

    if (profileSnap.exists()) {
      profile = profileSnap.data();
    }

    if (cvSnap.exists()) {
      cvData = cvSnap.data();
    }

    if (settingsSnap.exists()) {
      settings = settingsSnap.data();
    }

    const standardCategories = [
      { nameEn: "All", nameAr: "الكل" },
      { nameEn: "Full Mouth Rehabilitation Cases", nameAr: "حالات إعادة تأهيل الفم بالكامل" },
      { nameEn: "Surgery", nameAr: "جراحة" },
      { nameEn: "Crown", nameAr: "تيجان" },
      { nameEn: "Endodontics", nameAr: "علاج الجذور" },
      { nameEn: "Composite", nameAr: "كومبوزيت" },
      { nameEn: "Prosthodontics", nameAr: "تركيبات أسنان" },
      { nameEn: "General", nameAr: "عام" },
    ];
    
    dbCategories = [...standardCategories];
    if (!categoriesSnap.empty) {
      const fetched = categoriesSnap.docs.map((d) => d.data());
      const standardNames = standardCategories.map((c) => c.nameEn.toLowerCase());

      const filteredFetched = fetched.filter((cat) => {
        const catName = (cat.nameEn || "").trim().toLowerCase();
        return catName !== "pediatric" && !standardNames.includes(catName);
      });
      dbCategories = [...dbCategories, ...filteredFetched];
    }

    let casesList = casesSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((c) => c.isDraft !== true && c.featured === true);
    casesList.sort((a, b) => {
      let dateA = 0;
      let dateB = 0;
      if (a.createdAt) {
        const dateStrA =
          typeof a.createdAt === "string"
            ? a.createdAt.replace(" ", "T")
            : a.createdAt;
        dateA =
          typeof a.createdAt.toMillis === "function"
            ? a.createdAt.toMillis()
            : new Date(dateStrA).getTime();
      }
      if (b.createdAt) {
        const dateStrB =
          typeof b.createdAt === "string"
            ? b.createdAt.replace(" ", "T")
            : b.createdAt;
        dateB =
          typeof b.createdAt.toMillis === "function"
            ? b.createdAt.toMillis()
            : new Date(dateStrB).getTime();
      }
      return (dateB || 0) - (dateA || 0);
    });

    recentCases = casesList.slice(0, 3);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <main>
      <ViewTracker />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroText}>
            <div className={`${styles.badge} animate-slideUp stagger-1`}>
              {tHero("badge")}
            </div>
            <h1 className="animate-slideUp stagger-2">{tHero("title")}</h1>
            <h2 className={`${styles.heroSubtitle} animate-slideUp stagger-3`}>
              {tHero("subtitle")}
            </h2>
            <p className={`${styles.heroBio} animate-slideUp stagger-4`}>
              {tHero("description")}
            </p>
            <div className={`${styles.heroActions} animate-slideUp stagger-4`}>
              <Link href="/cases" className="btn-primary">
                {tHero("viewWork")}
              </Link>
              <Link href="/cv" className="btn-secondary">
                {tHero("viewCV")}
              </Link>
              <DownloadCvButton
                pdfUrl={cvData?.pdfUrl}
                pdfUrlAr={cvData?.pdfUrlAr}
                isLoading={false}
                className="btn-secondary"
                label={tHero("downloadCV")}
              />
            </div>
          </div>
          <div className={styles.heroImageWrapper}>
            {profile?.homeImageUrl ? (
              <Image
                src={profile.homeImageUrl}
                alt={tHero("title")}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.heroImage}
                priority
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className={styles.heroPlaceholder}>
                <span>{tHero("professionalPhoto")}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Profile Preview */}
      <section
        className={styles.section}
        style={{ backgroundColor: "var(--white)" }}
      >
        <div
          className="container"
          style={{ maxWidth: "800px", textAlign: "center" }}
        >
          <h2
            style={{
              fontSize: "2rem",
              color: "var(--primary-color)",
              marginBottom: "1.5rem",
              fontFamily: "var(--font-heading)",
            }}
          >
            {tProfile("title")}
          </h2>
          <p
            style={{
              fontSize: "1.125rem", /* 18px */
              color: "var(--text-muted)",
              lineHeight: "1.75",
              marginBottom: "2rem",
            }}
          >
            {locale === "ar"
              ? profile?.biographyAr
                ? profile.biographyAr.split("\n")[0]
                : tProfile("biography").split("\n")[0]
              : profile?.biography
                ? profile.biography.split("\n")[0]
                : tProfile("biography").split("\n")[0]}
          </p>
          <Link
            href="/profile"
            style={{
              color: "var(--secondary-color)",
              fontWeight: "600",
              textDecoration: "none",
              fontSize: "1.1rem",
            }}
          >
            {tProfile("viewProfile")}
          </Link>
        </div>
      </section>

      {/* Featured Cases */}
      {recentCases.length > 0 && (
        <section
          className={styles.section}
          style={{ backgroundColor: "#F8FAFC" }}
        >
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>{tCases("title")}</h2>
              <div className={styles.divider}></div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "2rem",
                width: "100%",
              }}
            >
              {recentCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="card"
                  style={{
                    padding: "0",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      height: "200px",
                      backgroundColor: "#E2E8F0",
                    }}
                  >
                    <ClientImageSlider
                      beforeImage={
                        caseItem.beforeImage || caseItem.beforeImageUrl
                      }
                      afterImage={caseItem.afterImage || caseItem.afterImageUrl}
                    />
                  </div>
                  <div
                    className={styles.caseCardContent}
                    style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}
                  >
                    <Link
                      href={`/cases/${caseItem.id}`}
                      style={{ textDecoration: "none", flexGrow: 1, display: "flex", flexDirection: "column" }}
                    >
                      <div className="categoriesWrapper">
                        {(caseItem.categories || []).map((cat) => {
                          const catObj = dbCategories.find(
                            (c) => c.nameEn === cat,
                          );
                          const displayName =
                            locale === "ar" && catObj?.nameAr
                              ? catObj.nameAr
                              : cat;
                          return (
                            <span key={cat} className="caseCategory">
                              {displayName}
                            </span>
                          );
                        })}
                      </div>
                      <p className="caseDesc">
                        {caseItem.description?.substring(0, 80)}
                        {caseItem.description?.length > 80 ? "..." : ""}
                      </p>
                    </Link>
                    <Link
                      href={`/cases/${caseItem.id}`}
                      className="btn-card-link"
                      style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
                    >
                      {tCases("viewCase")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <Link href="/cases" className="btn-primary">
                {tCases("viewAll")}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section
        id="contact"
        className={styles.section}
        style={{
          backgroundColor: "var(--primary-color)",
          color: "var(--white)",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)", /* Adjusted for scale */
              marginBottom: "2rem",
              color: "var(--white)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {tContact("title")}
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            {(() => {
              const waNumber =
                settings?.whatsapp || settings?.phone || "01553911135";
              return (
                <a
                  href={`https://wa.me/${waNumber.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    backgroundColor: "var(--secondary-color)",
                    color: "var(--white)",
                  }}
                >
                  {tContact("contactMe")}
                </a>
              );
            })()}
          </div>
        </div>
      </section>
    </main>
  );
}
