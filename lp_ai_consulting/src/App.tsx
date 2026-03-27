import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, TrendingUp, Shield, Users, CheckCircle, Zap } from 'lucide-react';

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
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900 to-blue-800 shadow-xl border-b-4 border-blue-400"
        >
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">AIビジネス戦略コンサルティング</h3>
            <button
              onClick={() => scrollToSection('offer')}
              className="px-6 py-2 bg-gradient-to-r from-blue-400 to-cyan-300 text-blue-900 font-bold rounded-full hover:shadow-lg transition-all duration-300"
            >
              無料相談を予約
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
        className="pt-20 pb-16 px-4 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-600 text-white"
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
                src="https://picsum.photos/400/500?random=20"
                alt="AIビジネス戦略"
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
                className="text-5xl md:text-6xl font-black mb-6 leading-tight text-cyan-100"
              >
                AIで、あなたのビジネスを3倍速く成長させる。
              </motion.h1>
              
              <p className="text-xl text-cyan-50 mb-8 leading-relaxed">
                200社以上の導入実績。平均ROI300%。
                AIビジネス戦略の専門家が、あなたの企業を次のステップへ導きます。
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-cyan-300" />
                  <span className="text-cyan-50">導入企業200社以上 | 平均ROI300%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-cyan-300" />
                  <span className="text-cyan-50">6ヶ月サポート保証</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-300" />
                  <span className="text-cyan-50">初回相談 通常¥50,000 → 完全無料</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('offer')}
                className="w-full py-4 bg-gradient-to-r from-cyan-300 to-blue-300 text-blue-900 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                無料相談を予約する
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
            こんなお悩みを抱えていませんか？
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '❓', title: 'AIをどう導入すれば？', desc: '漠然とした不安で、一歩を踏み出せない' },
              { icon: '💼', title: '何から始めるべき？', desc: '戦略的なAI導入計画がない' },
              { icon: '⚠️', title: '失敗が怖い', desc: 'AIプロジェクト失敗の話をよく聞く' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border-l-4 border-blue-500"
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
            私たちのAIコンサルティング戦略
          </h2>

          <div className="space-y-8">
            {[
              {
                icon: '📊',
                title: '1. 現状分析と戦略立案',
                desc: '業界分析、競合分析、あなたのビジネスの強み・弱みを徹底分析。AI導入による成長機会を特定します。',
                image: 'https://picsum.photos/400/300?random=21'
              },
              {
                icon: '🎯',
                title: '2. カスタム導入ロードマップ',
                desc: 'あなたのビジネス目標に合わせた、段階的なAI導入計画を設計。リスク最小化で最大効果を実現。',
                image: 'https://picsum.photos/400/300?random=22'
              },
              {
                icon: '🚀',
                title: '3. 実装支援と最適化',
                desc: '選定したAIツール・ベンダーとの交渉、実装、運用最適化まで。6ヶ月の継続サポート付き。',
                image: 'https://picsum.photos/400/300?random=23'
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
        className="py-16 px-4 bg-gradient-to-r from-blue-900 to-cyan-600"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white">
            {[
              { icon: Users, label: '導入企業数', value: '200社+' },
              { icon: TrendingUp, label: '平均ROI', value: '300%' },
              { icon: Shield, label: 'サポート期間', value: '6ヶ月' },
              { icon: Zap, label: '実装期間短縮', value: '70%' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-cyan-300" />
                <div className="text-3xl font-black mb-2">{stat.value}</div>
                <div className="text-sm font-semibold opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Case Studies */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        id="cases"
        className="py-16 px-4 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            導入企業の成功事例
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { industry: '金融機関', result: '営業効率45%向上', time: '4ヶ月で実装' },
              { industry: '製造業', result: '予測精度89%改善', time: '6ヶ月で構築' },
              { industry: 'EC企業', result: '売上200%増加', time: '3ヶ月で導入' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-8 bg-white rounded-xl shadow-lg border-t-4 border-blue-500"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.industry}</h3>
                <div className="mb-6">
                  <div className="text-3xl font-black text-blue-600 mb-2">{item.result}</div>
                  <p className="text-gray-600">{item.time}</p>
                </div>
                <div className="h-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded"></div>
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
        className="py-16 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            クライアントからの声
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: '田中太郎さん', company: '大手金融機関 CTO', text: 'AIロードマップを明確化してくれたおかげで、経営層の承認もスムーズでした。' },
              { name: '佐藤花子さん', company: 'E-commerce企業 CEO', text: '導入後わずか3ヶ月で売上が2倍に。本当に驚きました。' },
              { name: '鈴木一郎さん', company: '製造業 工場長', text: '予測精度が向上して、在庫管理が革新的に改善されました。' }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-8 bg-blue-50 rounded-xl shadow-lg border-l-4 border-blue-500"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{review.text}"</p>
                <div className="text-sm font-semibold text-gray-900">{review.name}</div>
                <div className="text-sm text-blue-600">{review.company}</div>
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
            className="bg-gradient-to-br from-blue-900 to-cyan-600 rounded-2xl p-12 text-white shadow-2xl"
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-center mb-8">初回相談 完全無料</h2>
            
            <div className="space-y-8 mb-8">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white bg-opacity-10 rounded-xl p-8"
              >
                <p className="text-center text-sm opacity-90 mb-2">通常相談料</p>
                <p className="text-center text-4xl line-through opacity-75 mb-4">¥50,000/h</p>
                <p className="text-center text-6xl font-black text-cyan-300">完全無料</p>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white bg-opacity-10 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-black">60分</div>
                  <div className="text-sm font-semibold">相談時間</div>
                </motion.div>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white bg-opacity-10 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-black">実績</div>
                  <div className="text-sm font-semibold">200社導入</div>
                </motion.div>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white bg-opacity-10 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-black">ROI300%</div>
                  <div className="text-sm font-semibold">平均成果</div>
                </motion.div>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white bg-opacity-10 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-black">6ヶ月</div>
                  <div className="text-sm font-semibold">サポート期間</div>
                </motion.div>
              </div>

              <div className="bg-white bg-opacity-10 rounded-xl p-6 space-y-3">
                <p className="font-semibold">✓ 現状分析を無料提供</p>
                <p className="font-semibold">✓ AI導入ロードマップ案を作成</p>
                <p className="font-semibold">✓ 専門家による戦略相談</p>
                <p className="font-semibold">✓ 追加費用なし（相談後のご契約は自由）</p>
              </div>
            </div>

            <motion.a
              href="https://www.event.noh-jesu.com/20260429"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="block w-full py-4 bg-white text-blue-900 font-black text-lg rounded-full text-center hover:shadow-lg transition-all duration-300"
            >
              無料相談を予約する
            </motion.a>

            <p className="text-center text-sm opacity-90 mt-6">
              ※お申し込みから3営業日以内にお返事します。
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
              { q: 'AIの知識がなくても大丈夫ですか？', a: 'もちろんです。むしろAIの知識がない経営層が対象です。専門知識は不要。戦略立案から実装までトータルでサポートします。' },
              { q: 'うちの業界でも成功していますか？', a: 'はい。金融、製造、EC、小売、不動産など様々な業界で導入実績があります。業界特性に合わせた戦略を提案します。' },
              { q: 'コンサルティング後の契約が必須ですか？', a: 'いいえ。初回相談後、ご契約はご自由です。お気軽にご相談ください。強引な営業はございません。' },
              { q: '中小企業ですが相談できますか？', a: 'もちろんです。むしろ中小企業こそAI導入で成長の可能性が広がります。企業規模に合わせた戦略を提案します。' },
              { q: '導入にはどのくらい費用がかかりますか？', a: '企業のニーズにより大きく異なります。初回相談で詳しくお見積もりさせていただきます。' }
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
                    className={`w-6 h-6 text-blue-500 transition-transform ${
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
        className="py-16 px-4 bg-gradient-to-r from-blue-900 to-cyan-600"
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-5xl font-black mb-8">AIで、ビジネスの可能性を引き出す</h2>
          <p className="text-2xl mb-12 opacity-95">
            200社以上が実現した平均ROI300%の成長。
            あなたの企業も次のステップへ。
          </p>
          
          <motion.a
            href="https://www.event.noh-jesu.com/20260429"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-12 py-5 bg-white text-blue-900 font-black text-xl rounded-full hover:shadow-2xl transition-all duration-300"
          >
            無料相談を予約する
          </motion.a>

          <p className="text-sm opacity-75 mt-8">
            初回相談60分 | 完全無料 | 実績200社 | ROI平均300%
          </p>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">AIビジネス戦略コンサルティング</h4>
              <p className="text-sm text-gray-400">200社以上の導入実績</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">サービス</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">戦略相談</a></li>
                <li><a href="#" className="hover:text-white">導入支援</a></li>
                <li><a href="#" className="hover:text-white">運用最適化</a></li>
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
                <a href="#" className="hover:text-cyan-400">LinkedIn</a>
                <a href="#" className="hover:text-cyan-400">Twitter</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <p className="text-center text-sm text-gray-400">
              © 2026 AI Business Strategy Consulting. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}