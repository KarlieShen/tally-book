import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import AddBill from "./components/AddBill";
import BillDetail from "./pages/BillDetail";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "bill-detail/:billId",
    element: <BillDetail />,
  },
  {
    path: "add-bill",
    element: <AddBill />,
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
