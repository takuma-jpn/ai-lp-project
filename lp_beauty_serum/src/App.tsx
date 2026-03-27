import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Star, Check, MessageCircle, ArrowRight } from 'lucide-react';

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
          className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b-2 border-yellow-400"
        >
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Luminous Bright Serum</h3>
            <button
              onClick={() => scrollToSection('offer')}
              className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold rounded-full hover:shadow-lg transition-all duration-300"
            >
              ¥8,800で購入
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
        className="pt-20 pb-16 px-4 bg-gradient-to-b from-white via-yellow-50 to-white"
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
                src="https://picsum.photos/400/500?random=1"
                alt="Luminous Bright Serum"
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
                3秒で、未来の肌を変える。
              </motion.h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                美白・抗シワ・保湿を一つで実現する、プレミアム美容液。
                30,000人以上が実感した、肌の劇的な変化。
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-700">満足度97.3% | 実績30,000人以上</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700">7日間返金保証付き</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700">初回限定50%OFF</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('offer')}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                今すぐ購入する
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
            こんな肌の悩みはありませんか？
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🌙', title: 'シミ・くすみが目立つ', desc: 'ファンデーションでカバーしきれない...' },
              { icon: '😔', title: '細かいシワが増えた', desc: '年齢とともに深まるシワに悩んでいる' },
              { icon: '💧', title: '乾燥で肌がカサカサ', desc: 'どんなクリームを使っても改善しない' }
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
            Luminous Bright Serumが選ばれる理由
          </h2>

          <div className="space-y-8">
            {[
              {
                title: '✨ ビタミンC誘導体 高濃度配合',
                desc: 'シミ・くすみを根本から防ぎ、透明感のある肌へ導きます。',
                image: 'https://picsum.photos/400/300?random=2'
              },
              {
                title: '🌿 ナノコラーゲン即浸透処方',
                desc: '従来品の5倍の浸透性。3秒で角質層まで届きます。',
                image: 'https://picsum.photos/400/300?random=3'
              },
              {
                title: '🛡️ 6種類のペプチド配合',
                desc: 'シワを直接ケア。8週間で目元のシワが33%削減*',
                image: 'https://picsum.photos/400/300?random=4'
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
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
        className="py-16 px-4 bg-gradient-to-r from-yellow-50 to-white"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            お客様からの声
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: '田中美咲さん', age: '42歳', text: 'シミが薄くなった!3ヶ月で肌が一段階明るくなりました。' },
              { name: '鈴木由紀さん', age: '38歳', text: '目元のシワが目立たなくなった。朝のメイクのノリが最高です。' },
              { name: '佐藤優子さん', age: '45歳', text: 'こんなに効果があるなんて。今では手放せません。' }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-8 bg-white rounded-xl shadow-lg border-l-4 border-yellow-400"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
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
            className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-12 text-white shadow-2xl"
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-center mb-8">限定キャンペーン実施中</h2>
            
            <div className="space-y-6 mb-8">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-sm opacity-90 mb-2">通常価格</p>
                <p className="text-3xl line-through opacity-75">¥17,600</p>
              </motion.div>

              <div className="text-center">
                <p className="text-sm opacity-90 mb-2">今だけ50%OFF</p>
                <p className="text-6xl font-black mb-4">¥8,800</p>
                <p className="text-lg font-semibold">税込・送料無料</p>
              </div>

              <div className="bg-white bg-opacity-20 rounded-xl p-6 space-y-3">
                <p className="font-semibold">✓ 7日間返金保証</p>
                <p className="font-semibold">✓ 初回送料無料</p>
                <p className="font-semibold">✓ 定期縛りなし</p>
                <p className="font-semibold">✓ 次回配送予定日の10日前までいつでも解約可能</p>
              </div>
            </div>

            <motion.a
              href="https://www.event.noh-jesu.com/20260429"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="block w-full py-4 bg-white text-yellow-500 font-black text-lg rounded-full text-center hover:shadow-lg transition-all duration-300"
            >
              今すぐ購入する
            </motion.a>

            <p className="text-center text-sm opacity-90 mt-6">
              ※期間限定キャンペーン。先着300名様までの特別価格です。
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
              { q: 'どのくらいで効果が出ますか？', a: '個人差がありますが、約4週間で肌の変化を実感される方が多いです。シミ・くすみは8週間程度での改善をお勧めしています。' },
              { q: '敏感肌でも使えますか？', a: 'はい、パッチテスト済みで敏感肌の方でも使用いただけます。ただし初めてご使用の場合は、少量から開始してください。' },
              { q: '定期購入の縛りはありますか？', a: 'いいえ。1回のみのご購入でも、定期購入でも選べます。定期購入でも次回配送日の10日前までいつでも解約可能です。' },
              { q: '返金保証の条件は？', a: '商品到着から7日以内にご連絡いただけば、理由不問で返金対応いたします。' }
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
                    className={`w-6 h-6 text-yellow-500 transition-transform ${
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
        className="py-16 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500"
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-5xl font-black mb-8">肌の悩みを解決するなら、今がチャンス</h2>
          <p className="text-2xl mb-12 opacity-95">
            限定キャンペーン中の50%OFFは、もう2日で終了です。
          </p>
          
          <motion.a
            href="https://www.event.noh-jesu.com/20260429"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-12 py-5 bg-white text-yellow-500 font-black text-xl rounded-full hover:shadow-2xl transition-all duration-300"
          >
            今すぐ購入する ¥8,800
          </motion.a>

          <p className="text-sm opacity-75 mt-8">
            30日間返金保証 | 送料無料 | 定期縛りなし
          </p>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Luminous Bright Serum</h4>
              <p className="text-sm text-gray-400">プレミアム美白美容液ブランド</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">サポート</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">お問い合わせ</a></li>
                <li><a href="#" className="hover:text-white">ご購入ガイド</a></li>
                <li><a href="#" className="hover:text-white">返品について</a></li>
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
                <a href="#" className="hover:text-yellow-400">Twitter</a>
                <a href="#" className="hover:text-yellow-400">Instagram</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <p className="text-center text-sm text-gray-400">
              © 2026 Luminous Bright Serum. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}