"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  DraftingCompass,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

import {
  Alert,
  Button,
  Card,
  LoadingSpinner,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/ui";

// Dummy useAuth
const useAuth = () => {
  return {
    principal: "abcd-1234-principal",
    isAuthenticated: true,
    identity: "dummy-identity",
  };
};

// Dummy backendService
const backendService = {
  initialize: async (_identity: any) => {
    return Promise.resolve(true);
  },
  getUserType: async () => {
    return Promise.resolve("Investor");
  },
};

export default function OnboardingPage() {
  const router = useRouter();
  const { principal, isAuthenticated, identity } = useAuth();

  const [copied, setCopied] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (!isAuthenticated || !identity) {
        setIsCheckingRegistration(false);
        return;
      }

      try {
        setError(null);
        await backendService.initialize(identity);
        const userTypeResult = await backendService.getUserType();

        if (userTypeResult) {
          setUserType(userTypeResult);
          if (userTypeResult === "Founder") {
            router.push("/founder");
          } else if (userTypeResult === "Investor") {
            router.push("/investor");
          }
        }
      } catch (err: any) {
        setError("Failed to check registration status. " + err.message);
      } finally {
        setIsCheckingRegistration(false);
      }
    };

    checkUserRegistration();
  }, [isAuthenticated, identity, router]);

  const formatPrincipal = (principal: string) => principal || "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(principal.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleInvestorClick = () => router.push("/register/investor");
  const handleFounderClick = () => router.push("/register/founder");

  if (isCheckingRegistration) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20">
        <LoadingSpinner size="xl" text="Checking your registration status..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20">
        <Card className="max-w-md w-full">
          <Alert type="error" title="Connection Error" message={error}>
            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => setIsCheckingRegistration(true)}
                variant="secondary"
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                Try Again
              </Button>
              <Button
                onClick={() => setError(null)}
                variant="secondary"
                className="flex-1"
              >
                Continue Anyway
              </Button>
            </div>
          </Alert>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-20">
      <h1 className="text-2xl sm:text-[40px] text-center font-ibm">
        Welcome to Plantify
      </h1>
      <p className="text-gray-600 text-sm mt-4 text-center">
        You’re successfully connected! <br />
        Now choose how you’d like to participate in our ecosystem.
      </p>

      {/* Identity */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-700 mb-2">Your Internet Identity:</p>
        <div
          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
            border border-white/20 bg-yellow-500 text-white font-mono text-sm font-medium
            shadow cursor-pointer hover:bg-yellow-600 transition-colors"
          onClick={copyToClipboard}
        >
          [{formatPrincipal(principal)}]
          {copied ? (
            <CheckCircle size={16} className="text-green-200" />
          ) : (
            <Copy size={16} />
          )}
        </div>
      </div>

      {/* Role Selection */}
      <div className="min-h-screen bg-purple-100/50 flex flex-col items-center justify-center px-6 mt-12 w-full">
        <h1 className="text-[40px] text-gray-900 mb-8 font-ibm">
          Choose Your Role
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl rounded-3xl overflow-hidden p-8">
          {/* Investor Card */}
          <Card className="bg-neutral-100 flex flex-col justify-between shadow-md">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Investor</h2>
              <ul className="space-y-3 text-gray-700 text-[16px]">
                <li>Invest in startups</li>
                <li>Receive monthly profit shares</li>
                <li>Community governance</li>
              </ul>
              <Button
                onClick={handleInvestorClick}
                variant="primary"
                className="mt-6 w-full bg-neutral-950 hover:bg-neutral-900"
              >
                <ShieldCheck size={16} /> Continue as Investor
              </Button>
            </div>
          </Card>

          {/* Founder Card */}
          <Card className="bg-neutral-100 flex flex-col justify-between shadow-md">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Startup Founder
              </h2>
              <ul className="space-y-3 text-gray-700 text-[16px]">
                <li>Secure community funding</li>
                <li>Retain business control</li>
                <li>Transparent, decentralized funding</li>
              </ul>
              <Button
                onClick={handleFounderClick}
                variant="primary"
                className="mt-6 w-full bg-purple-500 hover:bg-purple-600"
              >
                <DraftingCompass size={16} /> Continue as Founder
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-center text-[40px] font-ibm mb-8">
          Quick Comparison
        </h2>

        <Table striped hover>
          <TableHead>
            <TableRow>
              <TableHeader>Aspect</TableHeader>
              <TableHeader className="bg-purple-50 text-gray-900">
                Investor
              </TableHeader>
              <TableHeader className="text-gray-900">
                Startup Founder
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Investment Required</TableCell>
              <TableCell className="bg-purple-50">$50+</TableCell>
              <TableCell>Collateral required</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Risk Level</TableCell>
              <TableCell className="bg-purple-50">Medium</TableCell>
              <TableCell>High</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
