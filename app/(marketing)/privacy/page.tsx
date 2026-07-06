export const metadata = {
  title: "Privacy Policy",
  description: "CivicAI privacy policy and data handling practices.",
};

export default function PrivacyPage() {
  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="prose prose-slate dark:prose-invert mx-auto max-w-3xl">
        <h1>Privacy Policy</h1>
        <p className="lead text-muted-foreground">Last updated: July 5, 2026</p>

        <h2>Overview</h2>
        <p>
          CivicAI (&quot;we&quot;, &quot;our&quot;) is committed to protecting your
          privacy. This policy explains how we collect, use, and safeguard your
          information when you use our AI civic navigation platform.
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li>
            <strong>Queries:</strong> Questions you ask the AI assistant about
            government services.
          </li>
          <li>
            <strong>Uploaded documents:</strong> Images you upload for OCR verification
            (processed securely).
          </li>
          <li>
            <strong>Account data:</strong> Email and name if you create an account.
          </li>
          <li>
            <strong>Usage data:</strong> Pages visited, features used, and interaction
            patterns.
          </li>
        </ul>

        <h2>How We Use Your Data</h2>
        <ul>
          <li>Provide AI-powered civic navigation guidance</li>
          <li>Generate document checklists and reports</li>
          <li>Improve our AI models and service accuracy</li>
          <li>Send notifications you opt into</li>
        </ul>

        <h2>Data Security</h2>
        <p>
          We use industry-standard encryption, Supabase Row Level Security, and
          server-side processing. Uploaded documents are not shared with third parties.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may request access, correction, or deletion of your personal data by
          contacting us at privacy@civicai.pk.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy inquiries:{" "}
          <a href="mailto:privacy@civicai.pk">privacy@civicai.pk</a>
        </p>
      </div>
    </main>
  );
}
