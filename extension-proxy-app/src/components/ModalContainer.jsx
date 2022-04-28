const ModalContainer = ({ children }) => {
  return (
    <div className="pointer-events-auto flex items-end md:items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center block sm:p-0">
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      {/* This element is to trick the browser into centering the modal contents. */}
      <span
        className="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
      >
        &#8203;
      </span>

      <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:mt-8 sm:align-middle w-full md:max-w-sm">
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
