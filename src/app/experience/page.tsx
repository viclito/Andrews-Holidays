import Link from "next/link";
import { dbConnect } from "@/lib/mongodb";
import { Review } from "@/models/Review";

async function getReviews() {
  await dbConnect();
  const reviews = await Review.find({ isApproved: true })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("packageId", "title slug");
  
  return JSON.parse(JSON.stringify(reviews));
}

export default async function ExperiencePage() {
  const reviews = await getReviews();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="mb-6 text-5xl font-display font-semibold">
            Traveler Stories
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-400">
            Real experiences from travelers who have explored South India with us.
          </p>
          <div className="mt-10">
            <Link href="/review" className="btn-apple bg-white text-gray-900 hover:bg-gray-100">
              Share Your Story
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {reviews.length === 0 ? (
            <div className="text-center text-gray-500">
              <p className="text-lg">No stories yet. Be the first to share yours!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review: any) => (
                <div key={review._id} className="flex flex-col rounded-2xl border border-gray-100 bg-gray-50 p-8 transition-shadow hover:shadow-lg">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-600">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{review.userName}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                    ))}
                  </div>

                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    {review.title}
                  </h3>
                  
                  <p className="mb-6 flex-grow text-gray-600 leading-relaxed">
                    "{review.comment}"
                  </p>

                  {review.packageId && (
                    <div className="mt-auto border-t border-gray-200 pt-4">
                      <Link 
                        href={`/packages/${review.packageId.slug}`}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        Trip: {review.packageId.title} →
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
