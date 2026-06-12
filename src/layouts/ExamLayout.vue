<template>
  <!--
    ExamLayout: wrapper cho tất cả exam pages.
    - pt-16: tránh bị TopHeader (fixed h-16) che khuất
    - lg:pl-20: tránh bị collapsed LeftSidebar che (w-20)
    - bg-[#F8FAFC]: match màu nền HomeView
  -->
  <div class="min-h-screen bg-[#F8FAFC] pt-16 lg:pl-20 text-slate-800 font-sans">
    <slot />
  </div>
</template>
