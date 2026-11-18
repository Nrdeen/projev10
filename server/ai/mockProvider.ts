import type { AiProvider, AiProviderInput, AiProviderOutput } from './types';

function formatSar(amount: number): string {
  return `${Math.round(amount).toLocaleString('en-US')} ر.س`;
}

export class MockAiProvider implements AiProvider {
  readonly name = 'mock' as const;

  async generateReply(input: AiProviderInput): Promise<AiProviderOutput> {
    const { context } = input;
    const { intent, listings, totalMatchingListings, breedGuides, normalizedQuery } = context;

    if (intent === 'greeting') {
      return {
        provider: 'mock',
        text: [
          'أهلاً وسهلاً بك في مساعد سوق الغنم 2.0!',
          'تقدر تسألني بلهجتك عن الإعلانات المتوفرة (مثل: «أبي جذعان نعيمي بالرياض تحت 2000»)، أو تسألني عن متوسط أسعار السلالات وطريقة تقديم السوم والتوثيق.',
        ].join('\n'),
      };
    }

    if (intent === 'marketplace_help') {
      return {
        provider: 'mock',
        text: [
          'إليك طريقة استخدام منصة سوق الغنم 2.0:',
          '• **تقديم السوم والتواصل:** افتح أي إعلان منشور وسجل الدخول لتتمكن من إرسال عرض سعر (سوم) أو مراسلة البائع مباشرة أو إظهار رقم التواصل.',
          '• **نشر إعلان:** من زر «أضف إعلانك» يمكنك حفظ الإعلان كمسودة أو إرساله للمراجعة، ويُنشر بعد اعتماد المشرفين.',
          '• **الخصوصية والدفع:** لا يوجد دفع إلكتروني داخل المنصة؛ يتم الاتفاق والمعاينة المباشرة بين البائع والمشتري، كما تتوفر خدمة توثيق المربين من لوحة المشرف.',
        ].join('\n'),
      };
    }

    if (intent === 'breed_prices') {
      const targetGuides = breedGuides.slice(0, 3);
      if (targetGuides.length === 0) {
        return {
          provider: 'mock',
          text: 'يمكنك استعراض دليل السلالات والأسعار الاسترشادية من القائمة الرئيسية للاطلاع على أوزان وأسعار النعيمي والنجدي والحري والعارضي والسواكني.',
        };
      }
      const lines = targetGuides.map(
        (g) => `• **${g.breedName}** (${g.origin}): المدى السعري الاسترشادي ${g.priceRangeSar}، ومتوسط الوزن ${g.avgWeightKg}.`
      );
      return {
        provider: 'mock',
        text: [
          'هذه الأسعار الاسترشادية المسجلة حالياً في دليل السلالات بالمنصة:',
          ...lines,
          'إذا حاب أبحث لك عن عروض متوفرة الآن بسلالة أو منطقة معينة، اكتب لي طلبك (مثلاً: «ورني عروض النعيمي في الرياض»).',
        ].join('\n'),
      };
    }

    if (intent === 'marketplace_search') {
      if (listings.length > 0) {
        const filterHint =
          normalizedQuery.detectedDialectTerms.length > 0
            ? ` بناءً على طلبك (${normalizedQuery.detectedDialectTerms.join('، ')})`
            : '';
        const topLines = listings.slice(0, 3).map(
          (l) =>
            `• ${l.title} — **${formatSar(l.priceAmount)}** (${l.regionName}${l.city ? ` - ${l.city}` : ''})`
        );
        return {
          provider: 'mock',
          text: [
            `وجدت لك ${totalMatchingListings} إعلاناً منشوراً${filterHint}، وهذه أبرز الخيارات المتاحة حالياً:`,
            ...topLines,
            'اضغط على أي بطاقة بالأسفل لفتح صفحة الإعلان ومشاهدة التفاصيل أو تقديم سوم.',
          ].join('\n'),
        };
      }

      const fallbackGuide = breedGuides[0];
      return {
        provider: 'mock',
        text: [
          'لم أجد إعلانات منشورة مطابقة تماماً لهذه المعايير في الوقت الحالي.',
          fallbackGuide
            ? `يمكنك توسيع نطاق السعر أو المنطقة (مثلاً المدى الاسترشادي لسلالة ${fallbackGuide.breedName} يتراوح بين ${fallbackGuide.priceRangeSar})، أو تصفح صفحة «جميع الإعلانات».`
            : 'جرّب تخفيف شرط السعر أو اختيار منطقة أوسع للعثور على عروض قريبة.',
        ].join('\n'),
      };
    }

    // General livestock advice
    const norm = normalizedQuery.normalizedText;
    if (/تحصين|تطعيم|دموي|معوي|بيطر|صحه|فحص|معاينه/u.test(norm)) {
      return {
        provider: 'mock',
        text: [
          'عند معاينة الحلال قبل الشراء يُنصح بالتأكد من:',
          '1. التحصينات الأساسية (الدموي والمعوي والجدري حسب الموسم) ووضوحها في وصف الإعلان.',
          '2. نشاط الرأس، سلامة العيون والأنف من الإفرازات، وسلامة القوائم والأسنان (لمعرفة العمر: جذع، ثني، رباع).',
          '3. المعاينة المباشرة قبل الدفع، كما يمكنك البحث في المنصة عن الإعلانات «المحصنة» فقط.',
        ].join('\n'),
      };
    }

    return {
      provider: 'mock',
      text: [
        'أبشر! أقدر أساعدك في البحث عن المواشي داخل سوق الغنم 2.0 أو الإجابة عن الأسعار الاسترشادية للسلالات وطريقة استخدام المنصة.',
        'جرّب مثلاً: «أبي جذعان نعيمي بالرياض تحت 2000» أو «كم أسعار الحري والنجدي؟».',
      ].join('\n'),
    };
  }
}
