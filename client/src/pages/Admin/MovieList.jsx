import { Table } from "antd";

function MovieList() {
  const fakeMovies = [
    {
      key: "1",
      poster: "Image1",
      description: "Wolverine Vs Deadpool",
      duration: 120,
      genre: "Action",
      language: "English",
      releaseDate: "2024-08-01",
      name: "Wolverine Vs Deadpool",
    },
    {
      key: "2",
      poster: "Image2",
      description: "Wolverine Vs Deadpool",
      duration: 120,
      genre: "Action",
      language: "English",
      releaseDate: "2024-08-01",
      name: "Wolverine Vs Deadpool 2",
    },
  ];
  
  const tableHeadings = [
    {
      title: "Poster",
    },
    { title: "Movie Name", dataIndex: "name" },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Duration",
      dataIndex: "duration",
    },
    {
      title: "Genre",
      dataIndex: "genre",
    },
    {
      title: "Language",
      dataIndex: "language",
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
    },
    {
      title: "Action",
    },
  ];
  return (
    <div>
      <Table dataSource={movies} columns={tableHeadings} />
    </div>
  );
}

export default MovieList;
