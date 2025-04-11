import { FaTimes, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function NotificationModal({
  closeNotificationAndModal,
  notification,
  closeNotificationPopup,
}) {
  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center">
      <div className="p-6 bg-white items-center flex flex-col justify-center rounded-lg shadow-lg w-[25vw] h-[50vh] overflow-visible overflow-y-scroll scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400">
        <FaTimes
          className="cursor-pointer hover:opacity-70 self-end"
          onClick={closeNotificationAndModal}
        />

        <div className="flex flex-col items-center">
          {/* Icon instead of code */}
          <div className="p-2 mb-2 text-8xl text-black">
            {notification.code === 200 ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaTimesCircle className="text-red-500" />
            )}
          </div>

          <div className="p-2 text-2xl text-black">{notification.message}</div>
          <div className="p-2 mb-2 text-black">{notification.title}</div>

          <div className="flex gap-4">
            {/* Show Back button only if not success */}
            {notification.code !== 200 && (
              <button
                onClick={closeNotificationPopup}
                className="border-gray-300 border-2 py-2 px-3 text-black rounded-2xl hover:bg-gray-300"
              >
                Back
              </button>
            )}
            <button
              onClick={closeNotificationAndModal}
              className="bg-red-500 border-2 py-2 px-3 text-white rounded-2xl hover:bg-red-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;
