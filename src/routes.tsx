import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Statistics } from "./pages/Statistics";
import { AudioManagement } from "./pages/AudioManagement";
import { FeedWater } from "./pages/FeedWater";
import { Ventilation } from "./pages/Ventilation";
import { Layout } from "./layouts/Sidebar"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "statistics", Component: Statistics },
      { path: "audio", Component: AudioManagement },
      { path: "feed-water", Component: FeedWater },
      { path: "ventilation", Component: Ventilation },
    ],
  },
]);
