import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Heart, Users, Award, Clock, CheckCircle } from 'lucide-react';

export default function App() {
  const [isSticky, setIsSticky] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const GA_ID = 'G-XXXXXXXXXX';
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', GA_ID);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-white">
      {/* Sticky Header CTA */}
      {isSticky && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b-4 border-green-500"
        >
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🧘</div>
              <h3 className="text-lg font-bold text-gray-800">Online Yoga Subscription</h3>
            </div>
            <button
              onClick={() => scrollToSection('offer')}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-orange-400 text-white font-bold rounded-full hover:shadow-lg transition-all duration-300"
            >
              無料体験を始める
            </button>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        id="hero"
        className="pt-20 pb-16 px-4 bg-gradient-to-br from-green-50 via-orange-50 to-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Hero Image */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="order-2 md:order-1"
            >
              <img
                src="https://picsum.photos/400/500?random=10"
                alt="オンラインヨガ"
                className="w-full rounded-2xl shadow-2xl"
              />
            </motion.div>

            {/* Hero Content */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="order-1 md:order-2"
            >
              <motion.h1
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight"
              >
                毎日5分から。自宅で始める本格ヨガ。
              </motion.h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                忙しいあなたへ。時間・場所・経験を選ばないヨガプラットフォーム。
                初月無料で、40,000人以上が心と体を整えています。
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-green-500 fill-green-500" />
                  <span className="text-gray-700">40,000人以上が実践 | 継続率91%</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">初月完全無料 | キャンセル無料</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">50本以上のレッスン毎月追加</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('offer')}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-orange-400 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                無料体験を始める
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Problem Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        id="problem"
        className="py-16 px-4 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            こんなお悩みはありませんか？
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '⏰', title: 'スタジオに行く時間がない', desc: 'スケジュールが詰まっていて通えない' },
              { icon: '💰', title: '月額が高い', desc: 'ヨガ教室は月10,000円以上かかる...' },
              { icon: '😳', title: 'スタジオが混んでいる', desc: '初心者で人目が気になってしまう' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Solution Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        id="solution"
        className="py-16 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Online Yoga Subscriptionが選ばれる理由
          </h2>

          <div className="space-y-8">
            {[
              {
                icon: '📱',
                title: 'スマホ・PCで24時間いつでもレッスン',
                desc: '朝5分のモーニングヨガから、夜のリラックスヨガまで。自分のペースで続けられます。',
                image: 'https://picsum.photos/400/300?random=11'
              },
              {
                icon: '👩‍🏫',
                title: '厳選された30名以上の認定インストラクター',
                desc: '全員RYT200以上の資格を保有。初心者から上級者まで対応。',
                image: 'https://picsum.photos/400/300?random=12'
              },
              {
                icon: '🎯',
                title: '目的別に選べる400本以上のレッスン',
                desc: 'ダイエット、肩こり改善、瞑想、柔軟性向上など、あなたの目的に合わせて選べます。',
                image: 'https://picsum.photos/400/300?random=13'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ x: i % 2 === 0 ? -50 : 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
              >
                <div className="md:w-1/2">
                  <img src={item.image} alt={item.title} className="rounded-xl shadow-lg" />
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.icon} {item.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        id="stats"
        className="py-16 px-4 bg-gradient-to-r from-green-500 to-orange-400"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white">
            {[
              { icon: Users, label: 'アクティブ会員', value: '40,000人' },
              { icon: Award, label: '継続率', value: '91%' },
              { icon: Clock, label: '平均レッスン時間', value: '15分' },
              { icon: Heart, label: '満足度', value: '4.8/5.0' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4" />
                <div className="text-3xl font-black mb-2">{stat.value}</div>
                <div className="text-sm font-semibold opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Proof Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        id="proof"
        className="py-16 px-4 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            会員様からの声
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: '鈴木美咲さん', age: '35歳', text: '忙しい朝に5分のヨガ。これだけで1日が変わる。今は3年継続中です。' },
              { name: '田中真理さん', age: '42歳', text: '肩こりが劇的に改善。スタジオ通いより効果を実感しています。' },
              { name: '佐藤優紀さん', age: '28歳', text: '瞑想レッスンでストレスが軽くなりました。価格も手頃で続けやすい！' }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-8 bg-white rounded-xl shadow-lg border-l-4 border-green-500"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
                <div className="text-sm font-semibold text-gray-900">{review.name}</div>
                <div className="text-sm text-gray-600">{review.age}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Offer Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        id="offer"
        className="py-16 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-gradient-to-br from-green-500 via-green-400 to-orange-400 rounded-2xl p-12 text-white shadow-2xl"
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-center mb-8">今だけ初月無料キャンペーン</h2>
            
            <div className="space-y-8 mb-8">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white bg-opacity-20 rounded-xl p-8"
              >
                <p className="text-center text-sm opacity-90 mb-2">初月</p>
                <p className="text-center text-6xl font-black mb-4">無料</p>
                <p className="text-center text-lg">※2ヶ月目以降 月額¥3,980</p>
              </motion.div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl font-black">400+</div>
                  <div className="text-sm font-semibold">本のレッスン</div>
                </motion.div>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl font-black">30+</div>
                  <div className="text-sm font-semibold">認定インストラクター</div>
                </motion.div>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl font-black">24/7</div>
                  <div className="text-sm font-semibold">いつでも利用可能</div>
                </motion.div>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl font-black">99%</div>
                  <div className="text-sm font-semibold">会員満足度</div>
                </motion.div>
              </div>

              <div className="bg-white bg-opacity-20 rounded-xl p-6 space-y-3">
                <p className="font-semibold">✓ いつでもキャンセル無料</p>
                <p className="font-semibold">✓ クレジットカード登録必須（確認用）</p>
                <p className="font-semibold">✓ 初月後は月額¥3,980</p>
                <p className="font-semibold">✓ 50本以上のレッスン毎月追加</p>
              </div>
            </div>

            <motion.a
              href="https://www.event.noh-jesu.com/20260429"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="block w-full py-4 bg-white text-green-600 font-black text-lg rounded-full text-center hover:shadow-lg transition-all duration-300"
            >
              無料体験を始める
            </motion.a>

            <p className="text-center text-sm opacity-90 mt-6">
              ※キャンセルは2ヶ月目のお支払い前にいつでも可能です。
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        id="faq"
        className="py-16 px-4 bg-gray-50"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            よくあるご質問
          </h2>

          <div className="space-y-4">
            {[
              { q: 'ヨガ初心者でも大丈夫ですか？', a: '大丈夫です！初心者向けのレッスンが多数ご用意しています。難易度別に分かれているので、自分のペースで進められます。' },
              { q: '動画のダウンロードはできますか？', a: 'はい。アプリからレッスン動画をダウンロードすれば、オフラインで視聴できます。' },
              { q: '月の途中で登録しても大丈夫ですか？', a: 'はい。月の途中でも登録可能です。初月無料は登録月から計算されます。' },
              { q: '本当にキャンセル無料ですか？', a: 'はい。いつでも無料でキャンセルできます。2ヶ月目の請求前なら違約金もありません。' },
              { q: '複数デバイスで同時利用できますか？', a: 'はい。スマートフォン、タブレット、PCなど複数デバイスで利用可能です。同時ログインは1デバイスのみです。' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                  className="w-full p-6 bg-white hover:bg-gray-50 flex justify-between items-center transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 text-left">{item.q}</span>
                  <ChevronDown
                    className={`w-6 h-6 text-green-500 transition-transform ${
                      activeAccordion === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: activeAccordion === i ? 'auto' : 0,
                    opacity: activeAccordion === i ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 bg-gray-50 text-gray-700 border-t border-gray-200">
                    {item.a}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        id="final-cta"
        className="py-16 px-4 bg-gradient-to-r from-green-500 to-orange-400"
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-5xl font-black mb-8">さあ、あなたの変化を始めましょう</h2>
          <p className="text-2xl mb-12 opacity-95">
            初月無料で、400本以上のレッスンが試し放題。
          </p>
          
          <motion.a
            href="https://www.event.noh-jesu.com/20260429"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-12 py-5 bg-white text-green-600 font-black text-xl rounded-full hover:shadow-2xl transition-all duration-300"
          >
            無料体験を始める
          </motion.a>

          <p className="text-sm opacity-75 mt-8">
            キャンセル無料 | クレジットカード登録不要 | 2ヶ月目から月額¥3,980
          </p>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                🧘 Online Yoga Subscription
              </h4>
              <p className="text-sm text-gray-400">自宅で本格ヨガ</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">サポート</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">お問い合わせ</a></li>
                <li><a href="#" className="hover:text-white">ご利用ガイド</a></li>
                <li><a href="#" className="hover:text-white">技術サポート</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">法務</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">プライバシー</a></li>
                <li><a href="#" className="hover:text-white">利用規約</a></li>
                <li><a href="#" className="hover:text-white">特定商取引法</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">SNS</h5>
              <div className="flex gap-4 text-sm">
                <a href="#" className="hover:text-green-400">Twitter</a>
                <a href="#" className="hover:text-green-400">Instagram</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <p className="text-center text-sm text-gray-400">
              © 2026 Online Yoga Subscription. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}