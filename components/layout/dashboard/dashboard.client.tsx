'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SkillsOverview from './skills-overview';
import Cvoverview from './cv-overview';
import ProjectsPages from './projects-overview';

export default function DashboardPage() {
    const router = useRouter();

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      router.push('/login');
    }
  }, [router]);
  return (
    <div className="flex min-h-screen mt-25 sm:mt-20 lg:mt-0 w-full flex-col">
      <div className="flex flex-1 ">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className=" flex flex-col gap-10">
            <ProjectsPages />
            <SkillsOverview />
            <Cvoverview />
          </div>
        </main>
      </div>
    </div>
  )
}
