import React from "react";

const LazyDog = React.lazy(() => import("./Dog"));

export const App: React.FC = () => {
  React.useEffect(() => {
    console.log("hooks work!");
  });
  return (
    <>
      <h1>Pug for president!</h1>
      <React.Suspense fallback="calling dog..">
        <LazyDog />
      </React.Suspense>
    </>
  );
};
