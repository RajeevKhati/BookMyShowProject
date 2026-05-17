import { useEffect, useMemo, useState } from "react";
import { getAllMovies } from "../../api/movie";
import { toast } from "../../feedback/toast";
import { Empty, Input, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { PageHeading, SurfaceCard } from "../../components/layout";

const Home = () => {
  const [movies, setMovies] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const response = await getAllMovies();
      if (response.success) {
        setMovies(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredMovies = useMemo(() => {
    if (!movies?.length) return [];
    const q = searchText.trim().toLowerCase();
    if (!q) return movies;
    return movies.filter((m) =>
      (m.movieName || "").toLowerCase().includes(q),
    );
  }, [movies, searchText]);

  const openMovie = (movieId) => {
    navigate(`/movie/${movieId}?date=${moment().format("YYYY-MM-DD")}`);
  };

  return (
    <div className="mx-auto max-w-7xl pb-12">
      <PageHeading
        eyebrow="CineVault"
        title="Now showing"
        subtitle="Discover films playing near you — search by title and tap a poster for showtimes."
        align="left"
      />

      <div className="mb-10">
        <Input
          size="large"
          placeholder="Search movies by title…"
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined className="text-[#808080]" />}
          className="max-w-xl !rounded-xl"
          aria-label="Search movies"
        />
      </div>

      {movies === null ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spin size="large" />
        </div>
      ) : filteredMovies.length === 0 ? (
        <SurfaceCard className="py-16 text-center">
          <Empty
            description={
              searchText.trim()
                ? "No movies match your search."
                : "No movies available yet."
            }
          />
        </SurfaceCard>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
          {filteredMovies.map((movie) => (
            <li key={movie._id} className="list-none">
              <SurfaceCard className="group cursor-pointer !p-3 transition-[transform,box-shadow] hover:-translate-y-0.5 sm:!p-4">
                <button
                  type="button"
                  className="block w-full border-0 bg-transparent p-0 text-left text-inherit"
                  onClick={() => openMovie(movie._id)}
                >
                  <div className="overflow-hidden rounded-xl ring-1 ring-white/10 transition-all group-hover:ring-2 group-hover:ring-[#E50914]">
                    <img
                      src={movie.poster}
                      alt=""
                      className="aspect-[2/3] w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-3 line-clamp-2 text-center text-sm font-semibold leading-snug text-white transition-colors group-hover:text-[#FF3D47] sm:text-base">
                    {movie.movieName}
                  </p>
                </button>
              </SurfaceCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
