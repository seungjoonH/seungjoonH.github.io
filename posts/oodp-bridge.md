---
layout: single
title: "Bridge 패턴 - OODP"
subtitle: "Bridge 디자인 패턴에 대한 설명입니다"
date: "2023-06-11"
category: design-pattern
tags: [java, bridge]
---

## 1. 개요

* **Bridge 디자인 패턴**은 추상화와 구현부를 분리하여 독립적으로 변경할 수 있습니다.
 
## 2. 조건

* 다양한 플랫폼을 지원해야 합니다.
* 추상화와 구현을 분리하여 시스템을 확장하고자 합니다.
* 추상화와 구현을 독립적으로 변경해야 합니다.

## 3. 다이어그램

![bridge-default](/assets/images/posts/dp/bridge-default.png)

### 3.1. 설명

## 4. 구현

```java
public abstract class Abstractor {
  protected Implementor impl;
  public Abstractor(Implementor impl) {
    this.impl = impl;
  }
  public abstract void operation();
}

public class ConcreteAbstractor extends Abstractor {
  @Override
  public void operation() { impl.operation(); }
}
```

```java
public interface Implementor { void method(); }

public class ConcreteImplementor implements Implementor {
  @Override
  public void operation() {}
}
```

```java
public class Client {
  public static void main(String[] args) {
    Abstraction abstraction = new ConcreteAbstraction();
    abstraction.operation();
  }
}
```

## 5. 예시

```java
public abstract class MusicFormat {
  protected MusicPlayer musicPlayer;

  public MusicFormat(MusicPlayer player) {
    this.musicPlayer = player;
  }

  public abstract void decode();
}

class MP3 extends MusicFormat {
  public MP3(MusicPlayer player) {
    super(player);
  }

  @Override
  public void decode() {
    System.out.print("MP3 file decoded");
    musicPlayer.play();
  }
}

class WAV extends MusicFormat {
  public WAV(MusicPlayer player) {
    super(player);
  }

  @Override
  public void decode() {
    System.out.print("WAV file decoded");
    musicPlayer.play();
  }
}
```

```java
public interface MusicPlayer {
  void play();
}

class Melon implements MusicPlayer {
  @Override
  public void play() {
    System.out.println(" => Music played by Melon");
  }
}

class YoutubeMusic implements MusicPlayer {
  @Override
  public void play() {
    System.out.println(" => Music played by Youtube Music");
  }
}
```

```java
public class Client {
  public static void main(String[] args) {
    MusicPlayer melon = new Melon();
    MusicPlayer youtube = new YoutubeMusic();

    new MP3(melon).decode();
    new MP3(youtube).decode();
    new WAV(melon).decode();
    new WAV(youtube).decode();
  }
}
```

실행결과
```
MP3 file decoded => Music played by Melon
MP3 file decoded => Music played by Youtube Music
WAV file decoded => Music played by Melon
WAV file decoded => Music played by Youtube Music
```

## 6. 장단점

### 6.1. 장점

* 컴포넌트들의 확장성과 유연성을 제공합니다.
* 코드의 재사용성과 유지보수성이 높습니다.

### 6.2. 단점

* 코드 복잡성이 증가합니다.
