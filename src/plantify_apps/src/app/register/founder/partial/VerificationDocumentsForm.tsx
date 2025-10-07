import { Input, FileUpload } from "@/components/ui";

interface VerificationDocumentsFormProps {
  formData: {
    idNumber?: string;
    taxNumber?: string;
    governmentIdFile?: File;
    taxIdFile?: File;
    [key: string]: any;
  };
  handleInputChange?: (field: string, value: any) => void;
}

function VerificationDocumentsForm({
  formData,
  handleInputChange,
}: VerificationDocumentsFormProps) {
  const handleChange = (field: string, value: string) => {
    if (handleInputChange) {
      handleInputChange(field, value);
    }
  };

  const handleFileChange = (field: string, files: FileList | File[]) => {
    if (handleInputChange && files && files.length > 0) {
      handleInputChange(field, files[0]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-8 font-ibm">
        Verification Documents
      </h2>

      <div className="space-y-8">
        <Input
          type="text"
          label="Government ID number"
          placeholder="Enter your government-issued ID number (SSN, Passport, etc.)"
          value={formData.idNumber || ""}
          onChange={(e) => handleChange("idNumber", e.target.value)}
          required
        />

        <Input
          type="text"
          label="Tax ID number"
          placeholder="Enter your tax identification number"
          value={formData.taxNumber || ""}
          onChange={(e) => handleChange("taxNumber", e.target.value)}
          required
        />

        <div>
          <h3 className="text-lg text-gray-900 mb-6 font-ibm">Document Upload</h3>

          <div className="space-y-6">
            <FileUpload
              label="Government ID document"
              accept="image/*,.pdf"
              fileTypes="jpg, png, or pdf"
              maxSize="2MB"
              onFileSelect={(files) => handleFileChange("governmentIdFile", files)}
            />

            <FileUpload
              label="Tax ID document"
              accept="image/*,.pdf"
              fileTypes="jpg, png, or pdf"
              maxSize="2MB"
              onFileSelect={(files) => handleFileChange("taxIdFile", files)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationDocumentsForm;
