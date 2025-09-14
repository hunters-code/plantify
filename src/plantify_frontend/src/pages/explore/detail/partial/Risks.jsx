import { AlertTriangle } from "lucide-react";

export default function Risks() {
    return (
        <div className="max-w-3xl mt-8 space-y-8">
            {/* Risk Assessment */}
            <div className="rounded-2xl bg-neutral-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 font-ibm">Risk Assessment</h2>

                {/* Alert */}
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-gray-800">
                    <AlertTriangle className="text-orange-600 w-5 h-5 shrink-0" />
                    <span className="font-medium text-orange-600">Moderate Risk</span>
                </div>

                {/* Risks List */}
                <div className="mt-6 space-y-5">
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="text-sm font-semibold text-black">
                            Weather Dependency
                        </h3>
                        <p className="text-sm text-gray-600 mt-0.5">
                            <span className="font-semibold text-black">Mitigation Strategy: </span><br />
                            Controlled greenhouse environment and weather monitoring systems
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="text-sm font-semibold text-black">
                            Market Competition
                        </h3>
                        <p className="text-sm text-gray-600 mt-0.5">
                            <span className="font-semibold text-sm text-black">Mitigation Strategy: </span><br />
                            Strong IP protection and established customer relationships
                        </p>
                    </div>
                </div>
            </div>

            {/* General Investment Risks */}
            <div className="rounded-2xl bg-neutral-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 font-ibm">
                    General Investment Risks
                </h2>

                <div className="mt-4 bg-white p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900">
                        Investment Risks Include:
                    </h3>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                        <li>36-month lock period – no early exit</li>
                        <li>Returns depend on business performance</li>
                        <li>No guaranteed profit sharing</li>
                        <li>Potential loss of principal investment</li>
                        <li>Market volatility impact</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
