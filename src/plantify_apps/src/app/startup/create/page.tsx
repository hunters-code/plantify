import { useState, FormEvent } from "react";
import {
    Building2,
    Briefcase,
    Users,
    DollarSign,
    FileText,
    CheckCircle,
    CircleArrowRight,
    CircleArrowLeft,
    CircleCheckBig,
    Loader2,
} from "lucide-react";
import { Navbar, Footer } from "@/components";
import { Button, LoadingSpinner } from "@/components/ui";

const BasicInformationStep = ({ formData, setFormData, errors }: any) => (
    <div>
        <h2>Basic Information</h2>
        <input
            type="text"
            placeholder="Startup Name"
            value={formData.startupName}
            onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
            className="border p-2 w-full"
        />
        {errors.startupName && <p className="text-red-500">{errors.startupName}</p>}
    </div>
);

const BusinessDetailsStep = () => <p>Business Details</p>;
const TeamBackgroundStep = () => <p>Team Background</p>;
const FinancialProjectionsStep = () => <p>Financial Projections</p>;
const CollateralSetupStep = () => <p>Collateral Setup</p>;
const ReviewSubmitStep = () => <p>Review & Submit</p>;

// ✅ Type untuk Form Data
interface StartupForm {
    startupName: string;
    sector: string;
    foundedYear: string;
    companyType: string;
    location: string;
    description: string;
    website: string;
    problemStatement: string;
    solution: string;
    targetMarket: string;
    competitiveAdvantage: string;
    marketingStrategy: string;
    operationalProcess: string;
    founderName: string;
    founderRole: string;
    founderEmail: string;
    founderLinkedIn: string;
    founderBackground: string;
    advisors: string;
    fundingGoal: string;
    nftPrice: string;
    monthlyProfitSharing: string;
    expectedMonthlyRevenue: string;
    expectedMonthlyExpenses: string;
    breakEvenMonth: string;
    revenueModel: string;
    useOfFunds: string;
}

export default function CreateStartupPage() {
    // ✅ Auth dummy
    const isAuthenticated = true;
    const authLoading = false;

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<StartupForm>({
        startupName: "",
        sector: "",
        foundedYear: "",
        companyType: "",
        location: "",
        description: "",
        website: "",
        problemStatement: "",
        solution: "",
        targetMarket: "",
        competitiveAdvantage: "",
        marketingStrategy: "",
        operationalProcess: "",
        founderName: "",
        founderRole: "",
        founderEmail: "",
        founderLinkedIn: "",
        founderBackground: "",
        advisors: "",
        fundingGoal: "",
        nftPrice: "",
        monthlyProfitSharing: "",
        expectedMonthlyRevenue: "",
        expectedMonthlyExpenses: "",
        breakEvenMonth: "",
        revenueModel: "",
        useOfFunds: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Tabs (progress)
    const tabs = [
        { id: 1, label: "Basic Information", icon: <Building2 size={16} /> },
        { id: 2, label: "Business Details", icon: <Briefcase size={16} /> },
        { id: 3, label: "Team & Background", icon: <Users size={16} /> },
        { id: 4, label: "Financial Projections", icon: <DollarSign size={16} /> },
        { id: 5, label: "Collateral Setup", icon: <FileText size={16} /> },
        { id: 6, label: "Review & Submit", icon: <CheckCircle size={16} /> },
    ];

    // Validasi sederhana
    const validateStep = (currentStep: number) => {
        const newErrors: Record<string, string> = {};
        if (currentStep === 1 && !formData.startupName) {
            newErrors.startupName = "Startup name is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) setStep((prev) => prev + 1);
    };
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
    const handleEdit = (s: number) => setStep(s);

    // Submit dummy
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            console.log("📦 Dummy submitted data:", formData);
            alert("Startup submitted successfully!");
            setIsSubmitting(false);
        }, 1500);
    };

    // Loading dummy auth
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center items-center min-h-[60vh]">
                    <LoadingSpinner size="lg" />
                </div>
                <Footer />
            </div>
        );
    }

    // Dummy redirect
    if (!isAuthenticated) {
        alert("Please login (dummy redirect)");
        return null;
    }

    return (
        <div className="bg-gray-50 text-gray-900 min-h-screen">
            <Navbar />

            <div className="max-w-4xl mx-auto mt-8 mb-8">
                {/* Progress Steps */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-2 bg-white rounded-full p-2 shadow-sm w-full">
                        {tabs.map((tab, index) => (
                            <div key={tab.id} className="flex items-center w-full">
                                <button
                                    className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${step === tab.id
                                            ? "bg-gray-200 text-gray-900"
                                            : step > tab.id
                                                ? "text-gray-600"
                                                : "text-gray-400"
                                        }`}
                                    onClick={() => setStep(tab.id)}
                                >
                                    {tab.icon}
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                                {index < tabs.length - 1 && (
                                    <div className="w-8 h-px bg-gray-200 mx-1"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-neutral-100 rounded-2xl shadow-sm p-6">
                    {step === 1 && (
                        <BasicInformationStep
                            formData={formData}
                            setFormData={setFormData}
                            errors={errors}
                        />
                    )}
                    {step === 2 && <BusinessDetailsStep />}
                    {step === 3 && <TeamBackgroundStep />}
                    {step === 4 && <FinancialProjectionsStep />}
                    {step === 5 && <CollateralSetupStep />}
                    {step === 6 && <ReviewSubmitStep />}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-4 pt-4 border-t">
                    {step > 1 ? (
                        <Button onClick={prevStep} variant="secondary" className="flex gap-2">
                            <CircleArrowLeft size={16} /> Previous
                        </Button>
                    ) : (
                        <div></div>
                    )}

                    {step < tabs.length ? (
                        <Button onClick={nextStep} variant="primary" className="flex gap-2">
                            Next <CircleArrowRight size={16} />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            variant="primary"
                            className="flex gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Submitting...
                                </>
                            ) : (
                                <>
                                    <CircleCheckBig size={16} /> Submit Startup
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
