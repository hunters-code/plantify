import { Eye, MapPin, Sparkles, ThumbsUp, WalletCards } from "lucide-react";
import { Badge, Button, Card, ProgressBar } from "../../../../components/ui";

export default function StartupOverview() {
  return (
    <Card className="bg-neutral-100">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-3 items-center">
            <h2 className="text-xl font-semibold">EcoFarm Solutions</h2>
            <p className="text-sm text-gray-500 border border-neutral-200 px-2 py-1 rounded-lg flex gap-2">
              <MapPin size={16} />
              Bandung, Indonesia · 12 employees
            </p>
          </div>
          <div className='flex gap-2'>
            <Badge variant="primary" icon={<ThumbsUp size={16} />}>
              Featured
            </Badge>
            <Badge variant="success">
              Agriculture
            </Badge>
            <Badge variant="warning">
              Moderate Risk
            </Badge>
          </div>
        </div>
        <Button variant="secondary">
          <Eye size={16} />
          View Public Page
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col gap-2 text-[16px]">
          <span className="text-black font-ibm">Description</span>
          <span className="text-neutral-500">
            EcoFarm Solutions develops an integrated hydroponic farming system using IoT technology to
            help farmers boost their yields while preserving the environment.
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card className="flex gap-2">
          <Sparkles size={16} className="text-gray-400 mt-1" />
          <div className="w-full">
            <p className="text-sm text-gray-500 mb-1">Funding Progress: 45% Funded</p>
            <ProgressBar
              value={45}
              max={100}
              color="bg-purple-600"
              showValue={false}
            />
            <p className="text-sm text-gray-600 mt-1">$22,500 / $50,000</p>
          </div>
        </Card>

        <Card className="flex gap-2">
          <WalletCards size={16} className="text-gray-400 mt-1" />
          <div className="w-full">
            <p className="text-sm text-gray-500 mb-1">NFT Sales: 80%</p>
            <ProgressBar
              value={80}
              max={100}
              color="bg-orange-500"
              showValue={false}
            />
            <p className="text-sm text-gray-600 mt-1">80 / 100</p>
          </div>
        </Card>
      </div>
    </Card>
  );
}
