import { OfficeCanvas } from '@/components/OfficeCanvas';
import { EventLog } from '@/components/EventLog';
import { OfficeControlBar } from '@/components/OfficeControlBar';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <OfficeControlBar />
      <div className="flex">
        <OfficeCanvas />
        <EventLog />
      </div>
    </div>
  );
};

export default Index;
