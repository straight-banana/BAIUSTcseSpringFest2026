import { Map } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Mission5SubNav from '../../components/mission5/Mission5SubNav.jsx';
import CampusMap from '../../components/mission5/CampusMap.jsx';
import AlertCard from '../../components/mission5/AlertCard.jsx';
import { useEffect, useState } from 'react';
import { listAllSos } from '../../services/sosService.js';
import { mapSosAlertFromApi } from '../../utils/missionApiMaps.js';

export default function EmergencyMap() {
  const [active, setActive] = useState([]);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await listAllSos();
        if (!alive) return;
        const mapped = (res?.data?.alerts || res?.alerts || []).map(mapSosAlertFromApi).filter(Boolean);
        setActive(mapped.filter((a) => ['pending','received','responding'].includes(a.status)).slice(0, 4));
      } catch {
        if (alive) setActive([]);
      }
    })();
    return () => { alive = false; };
  }, []);
  return (
    <PageContainer>
      <PageHeader title="Emergency Map" subtitle="Live-location placeholder — real map coming soon." icon={<Map size={18} />} />
      <Mission5SubNav />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CampusMap />
        </div>
        <Card className="p-5">
          <SectionHeader title="Active Pins" description="Live alerts on the map" />
          <div className="space-y-3">
            {active.map((a) => <AlertCard key={a.id} alert={a} onClick={() => {}} />)}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
