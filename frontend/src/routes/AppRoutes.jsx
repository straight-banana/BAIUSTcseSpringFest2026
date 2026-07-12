import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import LoadingPage from '../pages/LoadingPage.jsx';
import { RequireAuth, RoleGuard } from './guards.jsx';
import ViewOnlyGate from './ViewOnlyGate.jsx';
import RoleSwitch from './RoleSwitch.jsx';
import StudentSeatView from '../pages/mission2/StudentSeatView.jsx';



// Route-level code splitting — everything below is lazy.
const Dashboard = lazy(() => import('../pages/Dashboard.jsx'));
const Landing = lazy(() => import('../pages/Landing.jsx'));

// Auth flow (only hit once, keep out of main bundle)
const Welcome = lazy(() => import('../pages/auth/Welcome.jsx'));
const RollLogin = lazy(() => import('../pages/auth/RollLogin.jsx'));
const Register = lazy(() => import('../pages/auth/Register.jsx'));
const RoleSelect = lazy(() => import('../pages/auth/RoleSelect.jsx'));
const AuthLoading = lazy(() => import('../pages/auth/AuthLoading.jsx'));
const AccessDenied = lazy(() => import('../pages/auth/AccessDenied.jsx'));
const SessionExpired = lazy(() => import('../pages/auth/SessionExpired.jsx'));
const AuthNotFound = lazy(() => import('../pages/auth/AuthNotFound.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));
const ErrorPage = lazy(() => import('../pages/ErrorPage.jsx'));

// Common shell pages
const MissionPage = lazy(() => import('../pages/MissionPage.jsx'));
const Analytics = lazy(() => import('../pages/Analytics.jsx'));
const Notifications = lazy(() => import('../pages/Notifications.jsx'));
const Settings = lazy(() => import('../pages/Settings.jsx'));
const Profile = lazy(() => import('../pages/Profile.jsx'));

// Role dashboards
const StudentDashboard = lazy(() => import('../pages/dashboards/StudentDashboard.jsx'));
const CaptainDashboardHome = lazy(() => import('../pages/dashboards/CaptainDashboardHome.jsx'));
const TeacherDashboard = lazy(() => import('../pages/dashboards/TeacherDashboard.jsx'));
const OfficeDashboard = lazy(() => import('../pages/dashboards/OfficeDashboard.jsx'));

// Mission 1
const Mission1Overview = lazy(() => import('../pages/mission1/Mission1Overview.jsx'));
const ComplaintSubmit = lazy(() => import('../pages/mission1/ComplaintSubmit.jsx'));
const ComplaintSubmitted = lazy(() => import('../pages/mission1/ComplaintSubmitted.jsx'));
const ComplaintHistory = lazy(() => import('../pages/mission1/ComplaintHistory.jsx'));
const M1CaptainDashboard = lazy(() => import('../pages/mission1/CaptainDashboard.jsx'));
const TeacherModeration = lazy(() => import('../pages/mission1/TeacherModeration.jsx'));
const ComplaintAnalytics = lazy(() => import('../pages/mission1/ComplaintAnalytics.jsx'));
const StrikeCounter = lazy(() => import('../pages/mission1/StrikeCounter.jsx'));
const EvidenceManager = lazy(() => import('../pages/mission1/EvidenceManager.jsx'));

// Mission 2
const Mission2Overview = lazy(() => import('../pages/mission2/Mission2Overview.jsx'));
const StudentManagement = lazy(() => import('../pages/mission2/StudentManagement.jsx'));
const ClassroomLayout = lazy(() => import('../pages/mission2/ClassroomLayout.jsx'));
const InteractiveSeating = lazy(() => import('../pages/mission2/InteractiveSeating.jsx'));
const Mission2Constraints = lazy(() => import('../pages/mission2/Constraints.jsx'));
const LineOfSight = lazy(() => import('../pages/mission2/LineOfSight.jsx'));
const GeneratedPlan = lazy(() => import('../pages/mission2/GeneratedPlan.jsx'));
const SeatAnalytics = lazy(() => import('../pages/mission2/SeatAnalytics.jsx'));

// Mission 3
const AIWorkspace = lazy(() => import('../pages/mission3/AIWorkspace.jsx'));
const SyllabusInput = lazy(() => import('../pages/mission3/SyllabusInput.jsx'));
// AIProcessing route removed — summarize is synchronous, no polling needed.
const AISummary = lazy(() => import('../pages/mission3/AISummary.jsx'));
const StudyPlan = lazy(() => import('../pages/mission3/StudyPlan.jsx'));
const StudyCalendar = lazy(() => import('../pages/mission3/StudyCalendar.jsx'));
const AIHistory = lazy(() => import('../pages/mission3/AIHistory.jsx'));
const TopicBreakdown = lazy(() => import('../pages/mission3/TopicBreakdown.jsx'));
const StudyStatistics = lazy(() => import('../pages/mission3/StudyStatistics.jsx'));

// Mission 4
const Mission4Overview = lazy(() => import('../pages/mission4/Mission4Overview.jsx'));
const LedgerHistory = lazy(() => import('../pages/mission4/LedgerHistory.jsx'));
const FinancialAnalytics = lazy(() => import('../pages/mission4/FinancialAnalytics.jsx'));
const TiffinDashboard = lazy(() => import('../pages/mission4/TiffinDashboard.jsx'));
const ExportsPage = lazy(() => import('../pages/mission4/ExportsPage.jsx'));

// Mission 5
const Mission5Landing = lazy(() => import('../pages/mission5/Mission5Landing.jsx'));
const SosReport = lazy(() => import('../pages/mission5/SosReport.jsx'));
const SosSuccess = lazy(() => import('../pages/mission5/SosSuccess.jsx'));
const SosHistory = lazy(() => import('../pages/mission5/SosHistory.jsx'));
const Mission5Captain = lazy(() => import('../pages/mission5/CaptainDashboard.jsx'));
const EmergencyMap = lazy(() => import('../pages/mission5/EmergencyMap.jsx'));
const EmergencyAnalytics = lazy(() => import('../pages/mission5/EmergencyAnalytics.jsx'));
const SosNotifications = lazy(() => import('../pages/mission5/SosNotifications.jsx'));

// Mission 6
const FactCheckerLanding = lazy(() => import('../pages/mission6/FactCheckerLanding.jsx'));
const FactCheckResult = lazy(() => import('../pages/mission6/FactCheckResult.jsx'));
const RuleBrowser = lazy(() => import('../pages/mission6/RuleBrowser.jsx'));
const RuleDetail = lazy(() => import('../pages/mission6/RuleDetail.jsx'));
const SearchHistory = lazy(() => import('../pages/mission6/SearchHistory.jsx'));
const TrendingMisinformation = lazy(() => import('../pages/mission6/TrendingMisinformation.jsx'));

// Mission 7
const PeerRatingDashboard = lazy(() => import('../pages/mission7/PeerRatingDashboard.jsx'));
const StudentList = lazy(() => import('../pages/mission7/StudentList.jsx'));
const RatingSubmit = lazy(() => import('../pages/mission7/RatingSubmit.jsx'));
const StudentProfile = lazy(() => import('../pages/mission7/StudentProfile.jsx'));
const CommentsPage = lazy(() => import('../pages/mission7/CommentsPage.jsx'));
const AnalyticsPage = lazy(() => import('../pages/mission7/AnalyticsPage.jsx'));
const ModerationPage = lazy(() => import('../pages/mission7/ModerationPage.jsx'));
const RatingHistory = lazy(() => import('../pages/mission7/RatingHistory.jsx'));
const LeaderboardPage = lazy(() => import('../pages/mission7/LeaderboardPage.jsx'));

// Mission 8
const RecommendationDashboard = lazy(() => import('../pages/mission8/RecommendationDashboard.jsx'));
const CandidateRankings = lazy(() => import('../pages/mission8/CandidateRankings.jsx'));
const CandidateProfile = lazy(() => import('../pages/mission8/CandidateProfile.jsx'));
const ScoreBreakdown = lazy(() => import('../pages/mission8/ScoreBreakdown.jsx'));
const CandidateCompare = lazy(() => import('../pages/mission8/CandidateCompare.jsx'));
const RecommendationAnalytics = lazy(() => import('../pages/mission8/RecommendationAnalytics.jsx'));
const TeacherReview = lazy(() => import('../pages/mission8/TeacherReview.jsx'));
const RecommendationHistory = lazy(() => import('../pages/mission8/RecommendationHistory.jsx'));
const M8Leaderboard = lazy(() => import('../pages/mission8/LeaderboardPage.jsx'));
const AssignCaptain = lazy(() => import('../pages/mission8/AssignCaptain.jsx'));

// Mission 9
const VotingDashboard = lazy(() => import('../pages/mission9/VotingDashboard.jsx'));
const CandidateGallery = lazy(() => import('../pages/mission9/CandidateGallery.jsx'));
const M9CandidateProfile = lazy(() => import('../pages/mission9/CandidateProfile.jsx'));
const M9CandidateCompare = lazy(() => import('../pages/mission9/CandidateCompare.jsx'));
const VotingBallot = lazy(() => import('../pages/mission9/VotingBallot.jsx'));
const VoteConfirmation = lazy(() => import('../pages/mission9/VoteConfirmation.jsx'));
const ElectionResults = lazy(() => import('../pages/mission9/ElectionResults.jsx'));
const ElectionAdmin = lazy(() => import('../pages/mission9/AdminDashboard.jsx'));
const ElectionHistory = lazy(() => import('../pages/mission9/ElectionHistory.jsx'));

// Mission 10 (Trust Graph)
const TrustDashboard = lazy(() => import('../pages/mission10/TrustDashboard.jsx'));
const TrustFlags = lazy(() => import('../pages/mission10/TrustFlags.jsx'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route element={<RequireAuth><RoleGuard><DashboardLayout /></RoleGuard></RequireAuth>}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/mission-1" element={<Mission1Overview />} />
          <Route path="/mission-1/submit" element={<ComplaintSubmit />} />
          <Route path="/mission-1/submitted" element={<ComplaintSubmitted />} />
          <Route path="/mission-1/history" element={<ComplaintHistory />} />
          <Route path="/mission-1/archive" element={<ComplaintHistory />} />
          <Route path="/mission-1/strikes" element={<StrikeCounter />} />
          <Route path="/mission-1/evidence" element={<EvidenceManager />} />
          <Route path="/mission-1/captain" element={<M1CaptainDashboard />} />
          <Route path="/mission-1/moderation" element={<TeacherModeration />} />
          <Route path="/mission-1/analytics" element={<ComplaintAnalytics />} />
          <Route path="/mission-2" element={<RoleSwitch studentEl={<StudentSeatView />} staffEl={<ViewOnlyGate><Mission2Overview /></ViewOnlyGate>} />} />
          <Route path="/mission-2/students" element={<RoleSwitch studentEl={<StudentSeatView />} staffEl={<ViewOnlyGate><StudentManagement /></ViewOnlyGate>} />} />
          <Route path="/mission-2/classroom" element={<RoleSwitch studentEl={<StudentSeatView />} staffEl={<ViewOnlyGate><ClassroomLayout /></ViewOnlyGate>} />} />
          <Route path="/mission-2/interactive" element={<RoleSwitch studentEl={<StudentSeatView />} staffEl={<ViewOnlyGate><InteractiveSeating /></ViewOnlyGate>} />} />
          <Route path="/mission-2/constraints" element={<RoleSwitch studentEl={<StudentSeatView />} staffEl={<ViewOnlyGate><Mission2Constraints /></ViewOnlyGate>} />} />
          <Route path="/mission-2/line-of-sight" element={<RoleSwitch studentEl={<StudentSeatView />} staffEl={<ViewOnlyGate><LineOfSight /></ViewOnlyGate>} />} />
          <Route path="/mission-2/plan" element={<RoleSwitch studentEl={<StudentSeatView />} staffEl={<ViewOnlyGate><GeneratedPlan /></ViewOnlyGate>} />} />
          <Route path="/mission-2/analytics" element={<RoleSwitch studentEl={<StudentSeatView />} staffEl={<ViewOnlyGate><SeatAnalytics /></ViewOnlyGate>} />} />




          <Route path="/mission-3" element={<AIWorkspace />} />
          <Route path="/mission-3/input" element={<SyllabusInput />} />
          <Route path="/mission-3/processing" element={<Navigate to="/mission-3/summary" replace />} />
          <Route path="/mission-3/summary" element={<AISummary />} />
          <Route path="/mission-3/plan" element={<StudyPlan />} />
          <Route path="/mission-3/calendar" element={<StudyCalendar />} />
          <Route path="/mission-3/history" element={<AIHistory />} />
          <Route path="/mission-3/topics" element={<TopicBreakdown />} />
          <Route path="/mission-3/stats" element={<StudyStatistics />} />
          <Route path="/mission-4" element={<Mission4Overview />} />
          <Route path="/mission-4/history" element={<LedgerHistory />} />
          <Route path="/mission-4/analytics" element={<FinancialAnalytics />} />
          <Route path="/mission-4/tiffin" element={<TiffinDashboard />} />
          <Route path="/mission-4/exports" element={<ExportsPage />} />
          <Route path="/mission-5" element={<Mission5Landing />} />
          <Route path="/mission-5/report" element={<SosReport />} />
          <Route path="/mission-5/success" element={<SosSuccess />} />
          <Route path="/mission-5/history" element={<SosHistory />} />
          <Route path="/mission-5/incidents" element={<SosHistory />} />
          <Route path="/mission-5/captain" element={<Mission5Captain />} />
          <Route path="/mission-5/map" element={<EmergencyMap />} />
          <Route path="/mission-5/analytics" element={<EmergencyAnalytics />} />
          <Route path="/mission-5/notifications" element={<SosNotifications />} />
          <Route path="/mission-6" element={<FactCheckerLanding />} />
          <Route path="/mission-6/result" element={<FactCheckResult />} />
          <Route path="/mission-6/rules" element={<RuleBrowser />} />
          <Route path="/mission-6/rules/:id" element={<RuleDetail />} />
          <Route path="/mission-6/history" element={<SearchHistory />} />
          <Route path="/mission-6/trending" element={<TrendingMisinformation />} />
          <Route path="/mission-7" element={<PeerRatingDashboard />} />
          <Route path="/mission-7/students" element={<StudentList />} />
          <Route path="/mission-7/students/:id" element={<StudentProfile />} />
          <Route path="/mission-7/rate" element={<RatingSubmit />} />
          <Route path="/mission-7/comments" element={<CommentsPage />} />
          <Route path="/mission-7/leaderboard" element={<LeaderboardPage />} />
          <Route path="/mission-7/history" element={<RatingHistory />} />
          <Route path="/mission-7/analytics" element={<AnalyticsPage />} />
          <Route path="/mission-7/moderation" element={<ModerationPage />} />
          <Route path="/mission-8" element={<RecommendationDashboard />} />
          <Route path="/mission-8/assign" element={<AssignCaptain />} />
          <Route path="/mission-8/rankings" element={<CandidateRankings />} />
          <Route path="/mission-8/leaderboard" element={<M8Leaderboard />} />
          <Route path="/mission-8/compare" element={<CandidateCompare />} />
          <Route path="/mission-8/review" element={<TeacherReview />} />
          <Route path="/mission-8/history" element={<RecommendationHistory />} />
          <Route path="/mission-8/analytics" element={<RecommendationAnalytics />} />
          <Route path="/mission-8/candidates/:id" element={<CandidateProfile />} />
          <Route path="/mission-8/candidates/:id/breakdown" element={<ScoreBreakdown />} />
          <Route path="/mission-9" element={<VotingDashboard />} />
          <Route path="/mission-9/candidates" element={<CandidateGallery />} />
          <Route path="/mission-9/candidates/:id" element={<M9CandidateProfile />} />
          <Route path="/mission-9/compare" element={<M9CandidateCompare />} />
          <Route path="/mission-9/ballot" element={<VotingBallot />} />
          <Route path="/mission-9/confirmation" element={<VoteConfirmation />} />
          <Route path="/mission-9/results" element={<ElectionResults />} />
          <Route path="/mission-9/admin" element={<ElectionAdmin />} />
          <Route path="/mission-9/history" element={<ElectionHistory />} />
          <Route path="/mission-10" element={<TrustDashboard />} />
          <Route path="/mission-10/flags" element={<TrustFlags />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/team" element={<Profile />} />
          <Route path="/mission" element={<MissionPage />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/captain" element={<CaptainDashboardHome />} />
          <Route path="/office" element={<OfficeDashboard />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
        </Route>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Navigate to="/" replace />} />
        <Route path="/auth/welcome" element={<Welcome />} />
        <Route path="/auth/login" element={<RollLogin />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/role" element={<RoleSelect />} />
        <Route path="/auth/loading" element={<AuthLoading />} />
        <Route path="/auth/denied" element={<AccessDenied />} />
        <Route path="/auth/expired" element={<SessionExpired />} />
        <Route path="/auth/*" element={<AuthNotFound />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
