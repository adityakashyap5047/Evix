import { Suspense } from "react";
import MyEventsClient from "./_components/my-events-client";

export default function Page() {
  return (
    <Suspense fallback={<MyEventsLoading />}>
      <MyEventsClient />
    </Suspense>
  );
}

function MyEventsLoading() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin h-8 w-8 rounded-full border-2 border-white/20 border-t-purple-500" />
    </div>
  );
}