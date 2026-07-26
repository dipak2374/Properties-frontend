import { lazy, Suspense } from 'react';
import { useLocation, BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import PageLoader from '../components/Common/PageLoader';
import BackToTop from '../components/Common/BackToTop';

// Eager load core entry page for zero FCP delay
import Home from '../pages/Home/Home';

// Lazy load remaining routes for code-splitting & performance optimization
const About = lazy(() => import('../pages/About/About'));
const Contact = lazy(() => import('../pages/Contact/Contact'));
const Login = lazy(() => import('../pages/Login/Login'));
const Register = lazy(() => import('../pages/Register/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword/ForgotPassword'));
const Properties = lazy(() => import('../pages/Properties/Properties'));
const All = lazy(() => import('../pages/All/All'));
const PropertyDetails = lazy(() => import('../pages/PropertyDetails/PropertyDetails'));
const Search = lazy(() => import('../pages/Search/Search'));
const Agents = lazy(() => import('../pages/Agents/Agents'));
const Agent = lazy(() => import('../pages/Agent/Agent'));
const Favorites = lazy(() => import('../pages/Favorites/Favorites'));
const Compare = lazy(() => import('../pages/Compare/Compare'));
const Appointment = lazy(() => import('../pages/Appointment/Appointment'));
const Profile = lazy(() => import('../pages/Profile/Profile'));
const Messages = lazy(() => import('../pages/Messages/Messages'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const AddProperty = lazy(() => import('../pages/Dashboard/AddProperty'));
const MyProperties = lazy(() => import('../pages/Dashboard/MyProperties'));
const DashboardAppointment = lazy(() => import('../pages/Dashboard/Appointment'));
const DashboardSettings = lazy(() => import('../pages/Dashboard/Settings'));
const DashboardEarnings = lazy(() => import('../pages/Dashboard/Earnings'));
const DashboardReviews = lazy(() => import('../pages/Dashboard/Reviews'));
const DashboardAnalytics = lazy(() => import('../pages/Dashboard/Analytics'));
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const Admin = lazy(() => import('../pages/Admin/Admin'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));
const Blog = lazy(() => import('../pages/Blog/Blog'));
const BlogDetails = lazy(() => import('../pages/BlogDetails/BlogDetails'));
const FAQ = lazy(() => import('../pages/FAQ/FAQ'));
const Help = lazy(() => import('../pages/Help/Help'));
const Sitemap = lazy(() => import('../pages/Sitemap/Sitemap'));
const Pricing = lazy(() => import('../pages/Pricing/Pricing'));
const Privacy = lazy(() => import('../pages/Privacy/Privacy'));
const Terms = lazy(() => import('../pages/Terms/Terms'));
const AuthCallback = lazy(() => import('../pages/AuthCallback/AuthCallback'));

function RouteTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AppShell() {
  const location = useLocation();

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<RouteTransition><Home /></RouteTransition>} />
              <Route path="about" element={<RouteTransition><About /></RouteTransition>} />
              <Route path="contact" element={<RouteTransition><Contact /></RouteTransition>} />
              <Route path="login" element={<RouteTransition><Login /></RouteTransition>} />
              <Route path="register" element={<RouteTransition><Register /></RouteTransition>} />
              <Route path="forgot-password" element={<RouteTransition><ForgotPassword /></RouteTransition>} />
              <Route path="properties" element={<RouteTransition><Properties /></RouteTransition>} />
              <Route path="all" element={<RouteTransition><All /></RouteTransition>} />
              <Route path="properties/:id" element={<RouteTransition><PropertyDetails /></RouteTransition>} />
              <Route path="search" element={<RouteTransition><Search /></RouteTransition>} />
              <Route path="agents" element={<RouteTransition><Agents /></RouteTransition>} />
              <Route path="favorites" element={<RouteTransition><Favorites /></RouteTransition>} />
              <Route path="wishlist" element={<RouteTransition><Favorites /></RouteTransition>} />
              <Route path="compare" element={<RouteTransition><Compare /></RouteTransition>} />
              <Route path="appointment" element={<RouteTransition><Appointment /></RouteTransition>} />
              <Route path="profile" element={<RouteTransition><Profile /></RouteTransition>} />
              <Route path="messages" element={<RouteTransition><Messages /></RouteTransition>} />
              <Route path="agent/:id" element={<RouteTransition><Agent /></RouteTransition>} />
              <Route path="blog" element={<RouteTransition><Blog /></RouteTransition>} />
              <Route path="blog/:slug" element={<RouteTransition><BlogDetails /></RouteTransition>} />
              <Route path="faqs" element={<RouteTransition><FAQ /></RouteTransition>} />
              <Route path="help" element={<RouteTransition><Help /></RouteTransition>} />
              <Route path="sitemap" element={<RouteTransition><Sitemap /></RouteTransition>} />
              <Route path="pricing" element={<RouteTransition><Pricing /></RouteTransition>} />
              <Route path="privacy" element={<RouteTransition><Privacy /></RouteTransition>} />
              <Route path="terms" element={<RouteTransition><Terms /></RouteTransition>} />
              <Route path="auth/callback" element={<RouteTransition><AuthCallback /></RouteTransition>} />
              <Route path="*" element={<RouteTransition><NotFound /></RouteTransition>} />
            </Route>

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="add-property" element={<AddProperty />} />
              <Route path="properties" element={<MyProperties />} />
              <Route path="drafts" element={<MyProperties defaultFilter="draft" />} />
              <Route path="pending" element={<MyProperties defaultFilter="pending" />} />
              <Route path="sold" element={<MyProperties defaultFilter="sold" />} />
              <Route path="appointment" element={<DashboardAppointment />} />
              <Route path="settings" element={<DashboardSettings />} />
              <Route path="earnings" element={<DashboardEarnings />} />
              <Route path="reviews" element={<DashboardReviews />} />
              <Route path="analytics" element={<DashboardAnalytics />} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <RouteTransition><Admin /></RouteTransition>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <BackToTop />
    </>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppShell />
    </BrowserRouter>
  );
}
