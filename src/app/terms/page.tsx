import {Button} from "@/components/ui/button";
import {redirect} from "next/navigation";

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Mad Alpacas Partner Program<br/><span
                className="text-lg font-medium">Partner Registration – Terms & Conditions</span></h1>

            <p className="mb-6">By clicking “I Agree” and submitting this registration form, you (“You” or
                “Partner”) acknowledge and agree to the following terms and conditions (“Terms”) governing your
                participation in the Mad Alpacas Partner Program (“Program”).</p>

            <h2 className="text-2xl font-semibold mb-2">1. Definitions</h2>
            <ul className="list-disc pl-6 mb-6">
                <li><strong>Mad Alpacas</strong>: The owner and operator of the Platform and Program.</li>
                <li><strong>Platform</strong>: The Mad Alpacas Partner System and associated dashboards, reporting
                    tools, and APIs.
                </li>
                <li><strong>Program</strong>: The multi-level partner network through which Partners earn
                    commissions on player activity.
                </li>
                <li><strong>Upline</strong>: The Partner one level above you in the hierarchy.</li>
                <li><strong>Downline</strong>: The Partners or Players you recruit.</li>
                <li><strong>Commission</strong>: The sum payable to a Partner, calculated by license type:
                    <ul className="list-disc pl-6">
                        <li><em>E-games & Specialty RNG</em>: a percentage of Gross Gaming Revenue (GGR)</li>
                        <li><em>Sports Betting & Specialty Tote</em>: a percentage of total bets</li>
                    </ul>
                </li>
            </ul>

            <h2 className="text-2xl font-semibold mb-2">2. Eligibility & Account Creation</h2>
            <ul className="list-disc pl-6 mb-6">
                <li>You must be at least 21 years old and legally capable of entering binding agreements.</li>
                <li>You must not have previously held a suspended or terminated Partner account with Mad Alpacas.
                </li>
                <li>You must provide accurate, complete, and up-to-date information. Mad Alpacas may suspend or
                    terminate applications containing fraudulent or incomplete data.
                </li>
            </ul>

            <h2 className="text-2xl font-semibold mb-2">3. Commission Computation Period</h2>
            <ul className="list-disc pl-6 mb-6">
                <li><strong>E-games & Specialty RNG:</strong> Bi-monthly (1–15; 16–end)</li>
                <li><strong>Sports Betting & Specialty Tote:</strong> Weekly (Monday–Sunday)</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-2">4. Partner Obligations</h2>
            <ul className="list-disc pl-6 mb-6">
                <li><strong>Compliance:</strong> Abide by all laws, regulations, and Mad Alpacas policies (KYC, AML,
                    responsible gaming, etc.).
                </li>
                <li><strong>No Double-Tagging:</strong> A Player may only be tagged under one Golden Partner.</li>
                <li><strong>Brand Use:</strong> Use of Mad Alpacas trademarks or materials must be pre-approved.
                </li>
                <li><strong>Account Security:</strong> You are responsible for your login credentials.</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-2">5. Confidentiality & Data Privacy</h2>
            <p className="mb-6">All non-public information (reports, rates, dashboards) is confidential. You must
                comply with data-protection laws when handling Partner or Player data.</p>

            <h2 className="text-2xl font-semibold mb-2">6. Suspension & Termination</h2>
            <ul className="list-disc pl-6 mb-6">
                <li><strong>Immediate Suspension</strong> if:
                    <ul className="list-disc pl-6">
                        <li>You breach these Terms</li>
                        <li>You engage in fraudulent, illegal, or abusive activity</li>
                        <li>You violate regulatory requirements</li>
                    </ul>
                </li>
                <li><strong>Termination:</strong> On termination or resignation, you forfeit unsettled commissions
                    unless agreed in writing.
                </li>
            </ul>

            <h2 className="text-2xl font-semibold mb-2">7. Limitation of Liability</h2>
            <ul className="list-disc pl-6 mb-6">
                <li>No liability for indirect, incidental, or consequential damages</li>
                <li>No liability for lost profits or lost data</li>
                <li>No liability for third-party system failures (payment gateways, data feeds)</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-2">8. Amendments</h2>
            <p className="mb-6">Mad Alpacas may update these Terms anytime via the Platform. Continued use
                constitutes acceptance of changes.</p>

            <h2 className="text-2xl font-semibold mb-2">9. Governing Law & Dispute Resolution</h2>
            <p className="mb-6">These Terms are governed by Philippine law. Disputes will be resolved via
                arbitration in Manila, under PDRC rules.</p>

            <p className="mt-10">
                By clicking <strong>“I Agree”</strong>, you confirm that you have read, understood, and accepted
                these Terms & Conditions.
            </p>
            <div className="mt-10">

                <Button>
                    Go Back
                </Button>
            </div>
        </div>
    )
}