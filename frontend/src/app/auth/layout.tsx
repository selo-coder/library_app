import { Book } from '../../assets'

const AuthLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="h-screen w-full flex flex-col lg:flex-row">
      <div
        style={{ minWidth: '50%' }}
        className="lg:h-full bg-red-500 flex justify-center"
      >
        <div className="flex flew-row lg:flex-col justify-around w-full lg:justify-center items-center gap-10 p-2 lg:p-0 text-white text-center">
          <Book className="h-20 w-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 stroke-white" />

          <span className="text-2xl sm:text-4xl lg:text-6xl">Library App</span>

          <span className="text-sm sm:text-xl lg:text-2xl lg:mt-48">
            {/* Wissensdurst? Diese App stillt ihn! */} Werbetext hier
          </span>
        </div>
      </div>
      <div className="flex flex-col h-full w-full justify-center items-center">
        <img
          src="/images/lib.jpg"
          className="h-full   w-full pointer-events-none select-none"
        />

        <div className="w-80 sm:w-96 opacity-95 p-4 bg-red-500 rounded-lg absolute shadow-2xl flex flex-col gap-6 text-white text-center">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
