
import {
  IoLocationOutline,
  IoNavigateOutline,
  IoTimeOutline,
} from "react-icons/io5";

const store = {
  name: "Nexora Computers",
  address: "Nexora Computers, Matara, Sri Lanka",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d834.238707376687!2d80.54490344818863!3d5.949125220506889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae1391ba024d997%3A0x1d3966a4df4e8f96!2sTulip%20Computers!5e0!3m2!1sen!2slk!4v1792522279685!5m2!1sen!2slk",
  directionsUrl: "https://maps.app.goo.gl/dq8vPqsmbGNvZon5A",
};

export default function StoreLocation() {
  const hasMap = store.mapEmbedUrl.startsWith(
    "https://www.google.com/maps/embed"
  );

  return (
    <section className="bg-[#09090b] py-20">
      <div className="page-wrapper">
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            FIND OUR STORE
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Come visit us.
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-400">
            Find our location on the map and get directions
            to our store.
          </p>
        </div>

        <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-[#111318] lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col justify-between p-7 sm:p-10">
            <div>
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 text-2xl text-blue-400">
                <IoLocationOutline />
              </div>

              <h3 className="text-2xl font-semibold text-white">
                {store.name}
              </h3>

              <p className="mt-4 text-sm leading-7 text-zinc-400">
                {store.address}
              </p>

              <div className="mt-8 flex items-start gap-3 border-t border-white/10 pt-7">
                <IoTimeOutline className="mt-0.5 text-xl text-blue-400" />

                <div>
                  <p className="text-sm font-medium text-white">
                    Store hours
                  </p>

                  <p className="mt-2 text-sm text-zinc-400">
                    Monday – Saturday
                    <br />
                    9:00 AM – 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            {store.directionsUrl.startsWith("https://") && (
              <a
                href={store.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex w-fit items-center gap-3 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-500"
              >
                <IoNavigateOutline className="text-lg" />
                Get Directions
              </a>
            )}
          </div>

          <div className="min-h-[350px] bg-[#181b22] lg:min-h-[430px]">
            {hasMap ? (
              <iframe
                title="Nexora Computers Store Location"
                src={store.mapEmbedUrl}
                width="100%"
                height="100%"
                className="h-full min-h-[350px] w-full border-0 lg:min-h-[430px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full min-h-[350px] items-center justify-center px-6 text-center text-sm text-zinc-500">
                Add your Google Maps embed URL to display
                the store location here.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
