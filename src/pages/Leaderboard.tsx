import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import LeaderboardCalendar from "../components/LeaderboardCalendar";
import LeaderboardResults from "../components/LeaderboardResults";
import LaunchArchive from "../components/LaunchArchive";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';
type FilterType = 'featured' | 'all';

const Leaderboard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Safely get search parameters
  const periodParam = searchParams ? searchParams.get('period') as Period | null : null;
  const yearParam = searchParams ? searchParams.get('year') : null;
  const monthParam = searchParams ? searchParams.get('month') : null;
  const weekParam = searchParams ? searchParams.get('week') : null;

  const isMobile = useIsMobile(768);

  // State management
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(periodParam || 'monthly');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedDate, setSelectedDate] = useState({
    year: yearParam ? parseInt(yearParam) : 2025,
    month: monthParam ? parseInt(monthParam) : 5, // May
    week: weekParam ? parseInt(weekParam) : null as number | null
  });
  const [showCalendar, setShowCalendar] = useState(!periodParam);

  // Initialize state from URL params
  useEffect(() => {
    if (periodParam) {
      setSelectedPeriod(periodParam);
      setShowCalendar(false);
    }
    const newYear = yearParam ? parseInt(yearParam) : selectedDate.year;
    const newMonth = monthParam ? parseInt(monthParam) : selectedDate.month;
    const newWeek = weekParam ? parseInt(weekParam) : null;

    setSelectedDate(prev => ({
      ...prev,
      year: newYear,
      month: newMonth,
      week: newWeek
    }));
  }, [periodParam, yearParam, monthParam, weekParam]);

  const handlePeriodChange = (newPeriod: Period) => {
    setSelectedPeriod(newPeriod);
    setShowCalendar(false);
    
    // Update URL based on period
    let newPath = `/leaderboard/${newPeriod}/${selectedDate.year}`;
    if (newPeriod === 'monthly' || newPeriod === 'weekly') {
      newPath += `/${selectedDate.month}`;
    }
    if (newPeriod === 'weekly' && selectedDate.week) {
      newPath += `/${selectedDate.week}`;
    }
    
    router.push(newPath);
  };

  const handleDateSelect = (dateInfo: { year: number; month?: number; week?: number }) => {
    setSelectedDate(prev => ({
      ...prev,
      ...dateInfo,
      week: dateInfo.week || null
    }));
    
    // Update URL when date is selected
    let newPath = `/leaderboard/${selectedPeriod}/${dateInfo.year}`;
    if (selectedPeriod === 'monthly' || selectedPeriod === 'weekly') {
      newPath += `/${dateInfo.month || selectedDate.month}`;
    }
    if (selectedPeriod === 'weekly' && dateInfo.week) {
      newPath += `/${dateInfo.week}`;
    }
    
    router.push(newPath);
    setShowCalendar(false);
  };

  const getPageTitle = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    switch (selectedPeriod) {
      case 'yearly':
        return `Best of ${selectedDate.year}`;
      case 'monthly':
        return `Best of ${monthNames[selectedDate.month - 1]} ${selectedDate.year}`;
      case 'weekly':
        return `Best of the week ${selectedDate.week ? `#${selectedDate.week}` : ''} of ${monthNames[selectedDate.month - 1]} ${selectedDate.year}`;
      case 'daily':
        return `Best of the day`;
      default:
        return 'Leaderboard';
    }
  };

  if (showCalendar) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* <Header /> */}
        <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <LeaderboardCalendar onDateSelect={handleDateSelect} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header Section */}
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {getPageTitle()}
              </h1>
              
              {/* Period Filters */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Button
                  variant={selectedPeriod === 'daily' ? 'default' : 'ghost'}
                  onClick={() => handlePeriodChange('daily')}
                  size="sm"
                  className={selectedPeriod === 'daily' ? 'bg-gray-900 text-white' : ''}
                >
                  Daily
                </Button>
                <Button
                  variant={selectedPeriod === 'weekly' ? 'default' : 'ghost'}
                  onClick={() => handlePeriodChange('weekly')}
                  size="sm"
                  className={selectedPeriod === 'weekly' ? 'bg-gray-900 text-white' : ''}
                >
                  Weekly
                </Button>
                <Button
                  variant={selectedPeriod === 'monthly' ? 'default' : 'ghost'}
                  onClick={() => handlePeriodChange('monthly')}
                  size="sm"
                  className={selectedPeriod === 'monthly' ? 'bg-gray-900 text-white' : ''}
                >
                  Monthly
                </Button>
                <Button
                  variant={selectedPeriod === 'yearly' ? 'default' : 'ghost'}
                  onClick={() => handlePeriodChange('yearly')}
                  size="sm"
                  className={selectedPeriod === 'yearly' ? 'bg-gray-900 text-white' : ''}
                >
                  Yearly
                </Button>
              </div>

              {/* Featured/All Filters */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedFilter('featured')}
                  size="sm"
                  className={`${selectedFilter === 'featured' 
                    ? 'text-[#EC729C] border-b-2 border-[#EC729C] rounded-none' 
                    : 'text-gray-600'
                  }`}
                >
                  Featured
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedFilter('all')}
                  size="sm"
                  className={`${selectedFilter === 'all' 
                    ? 'text-[#EC729C] border-b-2 border-[#EC729C] rounded-none' 
                    : 'text-gray-600'
                  }`}
                >
                  All
                </Button>
              </div>
            </div>

            {/* Results */}
            <LeaderboardResults 
              period={selectedPeriod}
              year={selectedDate.year}
              month={selectedDate.month}
              week={selectedDate.week}
              filter={selectedFilter}
            />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <LaunchArchive 
              currentYear={selectedDate.year}
              currentMonth={selectedDate.month}
              onDateSelect={handleDateSelect}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard; 