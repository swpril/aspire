const Loader = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div
        className="items-center flex justify-center animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
        role="status"
        aria-label="loading"
      ></div>
    </div>
  );
};

export default Loader;
