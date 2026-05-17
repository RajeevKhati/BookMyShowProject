import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieById } from "../../api/movie";
import { Divider, Input } from "antd";
import { toast } from "../../feedback/toast";
import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment";
import { getAllTheatresByMovie } from "../../api/show";
import { PageHeading, SurfaceCard } from "../../components/layout";
import { UiButton } from "../../components/ui";
import { theme as cinematicTheme } from "../../styles/theme";

const SingleMovie = () => {
  const params = useParams();
  const [movie, setMovie] = useState();
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [theatres, setTheatres] = useState([]);
  const navigate = useNavigate();

  const handleDate = (e) => {
    const next = moment(e.target.value).format("YYYY-MM-DD");
    setDate(next);
    navigate(`/movie/${params.id}?date=${e.target.value}`);
  };

  const getData = async () => {
    try {
      const response = await getMovieById(params.id);
      if (response.success) {
        setMovie(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getAllTheatres = async () => {
    try {
      const response = await getAllTheatresByMovie({
        movie: params.id,
        date,
      });
      if (response.success) {
        setTheatres(response.data);
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

  useEffect(() => {
    getAllTheatres();
  }, [date]);

  const metaRow = (label, value) => (
    <div className="flex flex-wrap gap-x-2 gap-y-1">
      <span
        className="text-sm font-medium"
        style={{ color: cinematicTheme.colors.textSecondary }}
      >
        {label}
      </span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <UiButton variant="secondary" size="middle" onClick={() => navigate("/")}>
          ← Back to browse
        </UiButton>
      </div>

      {movie && (
        <>
          <SurfaceCard className="!p-6 sm:!p-8">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
              <div className="mx-auto shrink-0 md:mx-0">
                <img
                  src={movie.poster}
                  alt=""
                  className="w-[160px] rounded-xl shadow-lg ring-1 ring-white/10 sm:w-[200px]"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-5">
                <PageHeading
                  align="left"
                  eyebrow="Movie details"
                  title={movie.movieName}
                />
                <dl className="m-0 grid gap-3 sm:grid-cols-2">
                  <div>{metaRow("Language", movie.language)}</div>
                  <div>{metaRow("Genre", movie.genre)}</div>
                  <div>
                    {metaRow(
                      "Release date",
                      moment(movie.releaseDate).format("MMM Do YYYY"),
                    )}
                  </div>
                  <div>{metaRow("Duration", `${movie.duration} min`)}</div>
                </dl>

                <Divider className="!my-2 border-[#2a2a2a]" />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[#B3B3B3]">
                    <CalendarOutlined aria-hidden />
                    Show date
                  </span>
                  <Input
                    type="date"
                    size="large"
                    min={moment().format("YYYY-MM-DD")}
                    value={date}
                    onChange={handleDate}
                    className="max-w-[260px] !rounded-xl"
                  />
                </div>
              </div>
            </div>
          </SurfaceCard>

          {theatres.length === 0 ? (
            <SurfaceCard className="py-12 text-center">
              <p
                className="m-0 text-lg font-semibold"
                style={{ color: cinematicTheme.colors.textSecondary }}
              >
                No showtimes for this date yet.
              </p>
              <p className="mt-2 mb-0 text-sm text-[#808080]">
                Pick another date above — theatres update daily.
              </p>
            </SurfaceCard>
          ) : (
            <section className="space-y-4">
              <h2 className="m-0 text-xl font-bold tracking-tight text-white">
                Theatres &amp; showtimes
              </h2>
              {theatres.map((theatre) => (
                <SurfaceCard key={theatre._id} className="!p-5 sm:!p-6">
                  <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
                    <div className="min-w-0 shrink-0 lg:w-[280px]">
                      <h3 className="m-0 text-lg font-semibold text-white">
                        {theatre.name}
                      </h3>
                      <p
                        className="mt-2 mb-0 text-sm leading-relaxed"
                        style={{ color: cinematicTheme.colors.textSecondary }}
                      >
                        {theatre.address}
                      </p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                        {theatre.shows
                          .slice()
                          .sort(
                            (a, b) =>
                              moment(a.time, "HH:mm").valueOf() -
                              moment(b.time, "HH:mm").valueOf(),
                          )
                          .map((singleShow) => (
                            <li key={singleShow._id}>
                              <button
                                type="button"
                                className="rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#E50914]/15 hover:border-[#E50914]"
                                style={{
                                  borderColor: cinematicTheme.colors.elevated,
                                  color: cinematicTheme.colors.text,
                                }}
                                onClick={() =>
                                  navigate(`/book-show/${singleShow._id}`)
                                }
                              >
                                {moment(singleShow.time, "HH:mm").format(
                                  "hh:mm A",
                                )}
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </SurfaceCard>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default SingleMovie;
