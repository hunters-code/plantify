import { Edit, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function ProfileInvestor() {
    return (
        <div>
            <div className=" mx-auto bg-white shadow-sm rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                    <Image
                        src="/assets/images/profile-default.webp"
                        alt="Profile Photo"
                        width={70}
                        height={70}
                        className="rounded-md"
                    />

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Ahmad Wijaya</h2>
                        <p className="text-gray-500 text-sm">
                            80% of raised funds (ckUSDC)
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                                <MapPin size={16} className="text-gray-500" />
                                Jakarta, Indonesia
                            </span>
                            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                                <Mail size={16} className="text-gray-500" />
                                ahmad.wijaya@email.com
                            </span>
                            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                                <Phone size={16} className="text-gray-500" />
                                +62 812-3456-7890
                            </span>
                        </div>
                    </div>
                </div>

                <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition">
                    <Edit size={18} className="text-gray-700" />
                    <span className="text-sm font-medium text-gray-800">Edit Profile</span>
                </button>
            </div>

            {/* Personal Information Section */}
            <div className=" mx-auto bg-white mt-8 rounded-2xl shadow-sm p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                        <input
                            type="text"
                            value="Ahmad Wijaya"
                            readOnly
                            className="w-full rounded-xl border border-gray-200 px-4 py-2 bg-gray-50 shadow-sm text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Location</label>
                        <input
                            type="text"
                            value="Jakarta, Indonesia"
                            readOnly
                            className="w-full rounded-xl border border-gray-200 px-4 py-2 bg-gray-50 shadow-sm text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Email Address</label>
                        <input
                            type="email"
                            value="ahmad.wijaya@email.com"
                            readOnly
                            className="w-full rounded-xl border border-gray-200 px-4 py-2 bg-gray-50 shadow-sm text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Occupation</label>
                        <input
                            type="text"
                            value="Senior Software Engineer"
                            readOnly
                            className="w-full rounded-xl border border-gray-200 px-4 py-2 bg-gray-50 shadow-sm text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
                        <input
                            type="text"
                            value="+62 812-3456-7890"
                            readOnly
                            className="w-full rounded-xl border border-gray-200 px-4 py-2 bg-gray-50 shadow-sm text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Company</label>
                        <input
                            type="text"
                            value="TechCorp Indonesia"
                            readOnly
                            className="w-full rounded-xl border border-gray-200 px-4 py-2 bg-gray-50 shadow-sm text-sm"
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-sm text-gray-500 mb-1">Bio</label>
                    <textarea
                        value="Experienced investor with focus on sustainable agriculture and technology startups"
                        readOnly
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2 bg-gray-50 shadow-sm text-sm"
                    />
                </div>
            </div>
        </div>
    )
}