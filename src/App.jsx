import { Route, Routes } from "react-router";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import Categories from "./pages/Categories.jsx";
import BookDetail from "./pages/BookDetail.jsx";
import About from "./pages/About.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalogo" element={<Catalog />} />
        <Route path="categorias" element={<Categories />} />
        <Route path="categorias/:categoryId" element={<Catalog />} />
        <Route path="libros/:bookId" element={<BookDetail />} />
        <Route path="acerca" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
