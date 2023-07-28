import { Book } from '../../assets'

const AuthLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="h-full min-h-screen relative w-full content-stretch	flex flex-col lg:flex-row">
      <div
        style={{ minWidth: '50%' }}
        className="lg:min-h-screen flex-1 relativ bg-red-500 flex justify-center"
      >
        <div className="flex flew-row lg:flex-col justify-around w-full lg:justify-center items-center gap-10 p-2 lg:p-0 text-white text-center">
          <Book className="h-20 w-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 stroke-white" />

          <span className="text-2xl sm:text-4xl lg:text-6xl">Library App</span>

          <span className="text-sm sm:text-xl lg:text-2xl lg:mt-48">
            {/* Wissensdurst? Diese App stillt ihn! */} Werbetext hier
          </span>
        </div>
      </div>
      <div
        style={{
          backgroundImage: `url("/images/lib.jpg")`,
        }}
        className="flex flex-col bg-cover bg-black flex-1 h-full lg:min-h-screen py-24 w-full justify-center items-center"
      >
        <div className="w-80 sm:w-96 opacity-95 p-4 bg-red-500 h-full rounded-lg relativ shadow-2xl flex flex-col gap-6 text-white text-center">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
