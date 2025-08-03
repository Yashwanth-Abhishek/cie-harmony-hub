import Layout from "@/components/Layout";
import Calendar from "@/components/Calendar";
import UpcomingEvents from "@/components/UpcomingEvents";
import CIEAbout from "@/components/CIEAbout";

const Index = () => {
  const handleDateClick = (date: Date) => {
    console.log("Date clicked:", date);
    // Here you could show event details or navigate to event planning
  };

  return (
    <Layout currentPage="home">
      <div className="space-y-8">
        {/* Main Calendar Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Calendar onDateClick={handleDateClick} />
          </div>
          <div>
            <UpcomingEvents />
          </div>
        </div>

        {/* CIE Information Section */}
        <CIEAbout />
      </div>
    </Layout>
  );
};

export default Index;
