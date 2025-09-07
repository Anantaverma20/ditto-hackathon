import { OfficeCanvas } from '@/components/OfficeCanvas';
import { EventLog } from '@/components/EventLog';
import { OfficeControlBar } from '@/components/OfficeControlBar';
import { SponsorFooter } from '@/components/SponsorFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-canvas flex flex-col">
      <OfficeControlBar />
      <div className="flex flex-1">
        <OfficeCanvas />
        <EventLog />
      </div>
      <SponsorFooter />
    </div>
  );
};

export default Index;
