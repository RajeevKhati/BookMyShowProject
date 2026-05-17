import { Tabs } from "antd";
import { PageHeading, SurfaceCard } from "../../components/layout";
import { theme as cinematicTheme } from "../../styles/theme";
import MovieList from "./MovieList";
import TheatresTable from "./TheatresTable";

const tabBarStyle = {
  marginBottom: 0,
  borderBottom: `1px solid ${cinematicTheme.colors.elevated}`,
};

const items = [
  {
    key: "movies",
    label: "Movies",
    children: (
      <div className="px-4 py-6 sm:px-6">
        <MovieList />
      </div>
    ),
  },
  {
    key: "theatres",
    label: "Theatres",
    children: (
      <div className="px-4 py-6 sm:px-6">
        <TheatresTable />
      </div>
    ),
  },
];

function Admin() {
  return (
    <div className="mx-auto max-w-7xl pb-12">
      <PageHeading
        align="left"
        eyebrow="CineVault"
        title="Admin"
        subtitle="Curate the catalogue and approve partner theatres."
      />

      <SurfaceCard className="!overflow-hidden !p-0">
        <Tabs
          defaultActiveKey="movies"
          size="large"
          items={items}
          tabBarStyle={tabBarStyle}
          className="admin-tabs [&_.ant-tabs-nav-wrap]:px-3 sm:[&_.ant-tabs-nav-wrap]:px-5 [&_.ant-tabs-tab]:pb-3 [&_.ant-tabs-tab-btn]:text-[#B3B3B3] [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-white [&_.ant-tabs-ink-bar]:!bg-[#E50914]"
        />
      </SurfaceCard>
    </div>
  );
}

export default Admin;
