import { OfficeCanvas } from '@/components/OfficeCanvas';
import { EventLog } from '@/components/EventLog';

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <OfficeCanvas />
      <EventLog />
    </div>
  );
};

export default Index;
